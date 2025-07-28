import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })

  // To "lock" again, delete the cookie or set it to false with immediate expiration
  res.cookies.set('unlocked', 'false', {
    httpOnly: true,
    path: '/',
    maxAge: 0, // immediately expire
    sameSite: 'strict',
  })

  return res
}