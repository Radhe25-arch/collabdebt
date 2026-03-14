import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { messages } = await req.json()
    
    // Fetch some context from the user's debt items to make the AI smarter
    const { data: debtItems } = await supabase
      .from('debt_items')
      .select('title, type, severity, status')
      .limit(10)

    const systemPrompt = `You are the CollabDebt AI Analyst. 
    You have access to the user's current technical debt report:
    ${JSON.stringify(debtItems, null, 2)}
    
    Help the user understand their debt and suggest resolution strategies. 
    Be concise, professional, and slightly futuristic (cyberpunk coder vibe).
    Keep responses to 2-3 sentences max unless a detailed plan is requested.`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content
      })),
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ content })
  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json({ error: 'System linkage failed' }, { status: 500 })
  }
}
