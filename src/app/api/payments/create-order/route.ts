import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PLAN_PRICES = {
  pro: { monthly: 1900, yearly: 15900 },    // in cents/paise
  team: { monthly: 4900, yearly: 39900 },
  enterprise: { monthly: 9900, yearly: 79900 },
}

// POST /api/payments/create-order
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan, billing } = await req.json()

  if (!plan || !billing) {
    return NextResponse.json({ error: 'plan and billing required' }, { status: 400 })
  }

  const prices = PLAN_PRICES[plan as keyof typeof PLAN_PRICES]
  if (!prices) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const amount = billing === 'yearly' ? prices.yearly : prices.monthly

  // In production: call Razorpay SDK to create order
  // const razorpay = new Razorpay({ key_id: ..., key_secret: ... })
  // const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: uuid })

  // Mock response for now
  const mockOrder = {
    id: `order_${Date.now()}`,
    amount,
    currency: 'INR',
    receipt: `rcpt_${user.id.slice(0, 8)}`,
  }

  // Save pending payment
  await supabase.from('payments').insert({
    user_id: user.id,
    plan,
    billing,
    amount: amount / 100,
    currency: 'INR',
    razorpay_order_id: mockOrder.id,
    status: 'pending',
  })

  return NextResponse.json({ data: mockOrder })
}
