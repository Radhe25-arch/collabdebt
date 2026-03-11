import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { debt_items, current_velocity, sprint_capacity } = await req.json()

  const prompt = `You are an engineering manager helping balance sprint work between features and technical debt.

Current sprint capacity: ${sprint_capacity || 10} story points
Current team velocity: ${current_velocity || 8} items/sprint
Open debt items:
${JSON.stringify(debt_items, null, 2)}

Recommend:
1. What percentage of this sprint to allocate to debt reduction (0-40%)
2. Which specific debt items to fix this sprint (max 3, prioritized by ROI)
3. Expected velocity improvement by next sprint if items are fixed

Respond ONLY with a JSON object:
{
  "sprint_percentage": number,
  "recommended_items": ["item_id_1", "item_id_2"],
  "velocity_gain": number,
  "total_savings": number,
  "reasoning": "one paragraph plain English"
}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const recommendation = JSON.parse(text)

    return NextResponse.json({ data: recommendation })
  } catch (error) {
    console.error('Sprint AI error:', error)
    return NextResponse.json({ error: 'Sprint recommendation failed' }, { status: 500 })
  }
}
