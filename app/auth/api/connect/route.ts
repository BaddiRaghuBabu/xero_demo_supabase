// app/auth/api/connect/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.XERO_CLIENT_ID!,
    redirect_uri: process.env.XERO_REDIRECT_URI!,
    scope: 'openid profile email accounting.transactions accounting.contacts',
    state: 'xero_state_123',
  })

  const xeroAuthUrl = `https://login.xero.com/identity/connect/authorize?${params.toString()}`

  return NextResponse.redirect(xeroAuthUrl)
}
