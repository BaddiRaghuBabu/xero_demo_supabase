import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createClient()

  const { data, error } = await (await supabase).auth.getUser()

  if (error || !data.user) {
    return NextResponse.redirect(`${requestUrl.origin}/login`)
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard?user_id=${data.user.id}`)
}
