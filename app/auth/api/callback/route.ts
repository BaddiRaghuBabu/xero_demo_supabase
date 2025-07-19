// app/auth/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import qs from 'qs'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  try {
    // Exchange code for tokens
    const tokenRes = await axios.post(
      'https://identity.xero.com/connect/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.XERO_REDIRECT_URI!,
        client_id: process.env.XERO_CLIENT_ID!,
        client_secret: process.env.XERO_CLIENT_SECRET!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const access_token = tokenRes.data.access_token

    // Get Xero tenantId
    const tenantRes = await axios.get('https://api.xero.com/connections', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const tenantId = tenantRes.data[0]?.tenantId

    // Fetch invoices
    const invoiceRes = await axios.get('https://api.xero.com/api.xro/2.0/Invoices', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Xero-tenant-id': tenantId,
        Accept: 'application/json',
      },
    })

    const invoices = invoiceRes.data?.Invoices

    // Insert into Supabase
    const { error } = await supabase.from('invoices').insert(invoices)
    if (error) {
      throw error
    }

    return NextResponse.redirect(`${process.env.XERO_REDIRECT_URI?.replace('/auth/api/callback', '')}/success`)
  } catch (err: any) {
    console.error('Xero callback error:', err.response?.data || err.message)
    return NextResponse.redirect(`${process.env.XERO_REDIRECT_URI?.replace('/auth/api/callback', '')}/error`)
  }
}
