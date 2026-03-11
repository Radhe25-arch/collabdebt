import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { findings } = await req.json()
  if (!findings || !Array.isArray(findings)) {
    return NextResponse.json({ error: 'findings array required' }, { status: 400 })
  }

  const prompt = `You are a technical debt analyst.
Static analysis found these issues in the codebase:
${JSON.stringify(findings, null, 2)}

For each finding, return a JSON array where each item has:
- "id": the finding's id
- "explanation": plain English explanation (1-2 sentences, non-technical, suitable for a manager)
- "cost_usd": estimated monthly dollar cost if left unfixed (integer)
- "fix_days": estimated working days to fix (number, can be decimal like 0.5)
- "severity": one of "critical", "high", "medium", "low"

Respond ONLY with a valid JSON array. No markdown, no explanation outside the JSON.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const explanations = JSON.parse(text)

    return NextResponse.json({ data: explanations })
  } catch (error) {
    console.error('Claude API error:', error)
    return NextResponse.json({ error: 'AI explanation failed' }, { status: 500 })
  }
}
