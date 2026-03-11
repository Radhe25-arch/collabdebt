import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const AI_DAILY_LIMIT_MINUTES = 120 // 2 hours

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check plan
    const { data: profile } = await supabase.from('users').select('plan').eq('id', user.id).single()
    if (!profile || profile.plan === 'free') {
      return NextResponse.json({ error: 'AI fix is a paid feature. Upgrade to Pro or above.' }, { status: 403 })
    }

    // Check daily AI usage limit (skip for enterprise)
    if (profile.plan !== 'enterprise') {
      const today = new Date().toISOString().split('T')[0]
      const { data: usage } = await supabase
        .from('ai_usage')
        .select('minutes_used')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      const minutesUsed = usage?.minutes_used || 0
      if (minutesUsed >= AI_DAILY_LIMIT_MINUTES) {
        return NextResponse.json({
          error: 'Daily AI quota used up. Resets at midnight IST.',
          quota_exceeded: true,
          minutes_used: minutesUsed,
          limit: AI_DAILY_LIMIT_MINUTES,
        }, { status: 429 })
      }
    }

    const { code, language, instruction, context } = await req.json()
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

    const startTime = Date.now()

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are an expert ${language || 'TypeScript'} developer helping fix technical debt.

${context ? `Context: ${context}\n\n` : ''}Code to fix:
\`\`\`${language || 'typescript'}
${code}
\`\`\`

${instruction ? `Instruction: ${instruction}` : 'Fix any technical debt, bugs, or code quality issues in this code.'}

Respond with ONLY a JSON object (no markdown):
{
  "fixed_code": "the complete fixed code here",
  "explanation": "what was wrong and what you changed (plain English, 2-3 sentences)",
  "changes": ["change 1", "change 2"],
  "severity": "how serious the issues were"
}`
      }],
    })

    const elapsed = Math.ceil((Date.now() - startTime) / 60000) || 1

    // Update AI usage
    const today = new Date().toISOString().split('T')[0]
    const { data: existing } = await supabase
      .from('ai_usage')
      .select('id, minutes_used, tokens_used')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens

    if (existing) {
      await supabase.from('ai_usage').update({
        minutes_used: existing.minutes_used + elapsed,
        tokens_used: existing.tokens_used + tokensUsed,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('ai_usage').insert({
        user_id: user.id,
        date: today,
        minutes_used: elapsed,
        tokens_used: tokensUsed,
      })
    }

    let parsed
    try {
      const clean = responseText.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(clean)
    } catch {
      parsed = { fixed_code: code, explanation: responseText, changes: [] }
    }

    return NextResponse.json({ ...parsed, tokens_used: tokensUsed })
  } catch (err) {
    console.error('AI fix error:', err)
    return NextResponse.json({ error: 'AI request failed' }, { status: 500 })
  }
}
