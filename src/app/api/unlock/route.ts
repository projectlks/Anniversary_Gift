import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { passcode } = await req.json()

  const secret = process.env.APP_SECRET_CODE // Set this in your .env

  if (passcode === secret) {
    const res = NextResponse.json({ success: true })

    // Set the cookie to mark the session as unlocked
    res.cookies.set('unlocked', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'strict',
    })

    return res
  }

  return NextResponse.json({ success: false, message: 'Invalid code' }, { status: 401 })
}
