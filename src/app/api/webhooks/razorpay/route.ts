import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    // Verify webhook signature
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (expected !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    const supabase = await createAdminClient()

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const notes = payment.notes || {}

      if (notes.user_id && notes.plan) {
        await supabase
          .from('users')
          .update({ plan: notes.plan })
          .eq('id', notes.user_id)

        await supabase.from('payments').upsert({
          user_id: notes.user_id,
          plan: notes.plan,
          billing: notes.billing || 'monthly',
          amount: payment.amount / 100,
          currency: payment.currency,
          razorpay_payment_id: payment.id,
          status: 'success',
        }, { onConflict: 'razorpay_payment_id' })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Razorpay webhook error:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
