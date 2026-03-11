import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin key for background tasks
)

export async function GET() {
  try {
    // 1. Fetch current metrics
    const { data: debtItems, error: debtError } = await supabase
      .from('debt_items')
      .select('*')
    
    if (debtError) throw debtError

    const openItems = debtItems.filter(d => d.status !== 'fixed')
    const totalCost = openItems.reduce((s, d) => s + (d.cost_usd || 0), 0)
    const criticalCount = openItems.filter(d => d.severity === 'critical').length

    // 2. Fetch recent activity
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const recentItems = debtItems.filter(d => d.created_at >= last24h)
    const resolvedItems = debtItems.filter(d => d.fixed_at && d.fixed_at >= last24h)

    // 3. Prepare summary
    const summary = {
      timestamp: new Date().toISOString(),
      metrics: {
        open_anomalies: openItems.length,
        critical_threats: criticalCount,
        monthly_cost_impact: totalCost,
      },
      activity_24h: {
        detected: recentItems.length,
        neutralized: resolvedItems.length
      },
      top_anomalies: openItems
        .sort((a, b) => (b.cost_usd || 0) - (a.cost_usd || 0))
        .slice(0, 5)
        .map(d => ({
          title: d.title,
          cost: d.cost_usd,
          severity: d.severity
        }))
    }

    // In a real app, you would send this via Resend or AWS SES here.
    // console.log('Admin Summary Email Payload:', summary);

    return NextResponse.json({ 
      success: true, 
      message: 'Admin summary generated successfully',
      data: summary 
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
