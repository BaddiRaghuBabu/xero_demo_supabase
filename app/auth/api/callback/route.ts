// app/auth/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import qs from 'qs'
import axios, { AxiosError } from 'axios'
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
    // Step 1: Exchange code for access token
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

    // Step 2: Get Xero tenant ID
    const tenantRes = await axios.get('https://api.xero.com/connections', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const tenantId = tenantRes.data[0]?.tenantId

    // Step 3: Fetch invoices
    const invoiceRes = await axios.get('https://api.xero.com/api.xro/2.0/Invoices', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Xero-tenant-id': tenantId,
        Accept: 'application/json',
      },
    })

    const invoices = invoiceRes.data?.Invoices

    // Step 4: Insert invoices into Supabase
    const { error } = await supabase.from('invoices').insert(invoices)
    if (error) {
      throw new Error(error.message)
    }

    // Redirect to success page
    const redirectUrl = process.env.XERO_REDIRECT_URI?.replace('/auth/api/callback', '') + '/success'
    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    const error = err as AxiosError
    console.error('Xero callback error:', error.response?.data || error.message)

    const redirectUrl = process.env.XERO_REDIRECT_URI?.replace('/auth/api/callback', '') + '/error'
    return NextResponse.redirect(redirectUrl)
  }
}
