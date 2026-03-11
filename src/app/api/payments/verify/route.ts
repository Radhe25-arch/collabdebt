import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, billing } = await req.json()

    // Verify Razorpay signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Upgrade user plan
    const { error: updateError } = await supabase
      .from('users')
      .update({ plan })
      .eq('id', user.id)

    if (updateError) throw updateError

    // Record payment
    await supabase.from('payments').insert({
      user_id: user.id,
      plan,
      billing,
      amount: billing === 'yearly'
        ? plan === 'pro' ? 159 : plan === 'team' ? 399 : 799
        : plan === 'pro' ? 19 : plan === 'team' ? 49 : 99,
      currency: 'USD',
      razorpay_order_id,
      razorpay_payment_id,
      status: 'success',
    })

    // Send receipt email
    const { data: profile } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', user.id)
      .single()

    if (profile) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, name: profile.name, plan, billing, payment_id: razorpay_payment_id }),
      })
    }

    return NextResponse.json({ success: true, plan })
  } catch (err) {
    console.error('Payment verify error:', err)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
