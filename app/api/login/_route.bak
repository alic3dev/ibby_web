import 'server-only'

import type { UUID } from 'crypto'
import type { ServerRuntime } from 'next'
import type { NextRequest } from 'next/server'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

import * as constants from '@/app/constants'
import * as caches from '@/utils/server/caches'

export const runtime: ServerRuntime = 'nodejs'

const ratelimit: { [type: string]: Ratelimit } = {
  login: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    ephemeralCache: caches.ratelimit.login,
    prefix: '@upstash/ratelimit/ibby_login',
  }),
}

const sevenDaysMs: number = 604800000

export const POST = async (req: NextRequest) => {
  const clientIp: string =
    req.ip ||
    req.headers.get('X-Real-IP') ||
    req.headers.get('X-Forwarded-For')?.replace(/\s/g, '').split(',').pop() ||
    '127.0.0.1'

  if (!(await ratelimit.login.limit(clientIp)).success) {
    return NextResponse.json({}, { status: 429 })
  }

  let i1: string = ''
  let i2: string = ''

  try {
    const parsedBody: { i1: string; i2: string } = await req.json()

    if (parsedBody && typeof parsedBody === 'object') {
      i1 = parsedBody.i1
      i2 = parsedBody.i2
    }
  } catch {}

  if (!i1 || !i2 || typeof i1 !== 'string' || typeof i2 !== 'string') {
    return NextResponse.json({}, { status: 400 })
  } else if (
    i1 !== process.env.IBBY_LOGIN_I1 ||
    i2 !== process.env.IBBY_LOGIN_I2
  ) {
    return NextResponse.json({}, { status: 401 })
  }

  return NextResponse.json({}, { status: 401 })

  const iaAuthKey: UUID = crypto.randomUUID() as UUID
  const expiresAtMS: number = Date.now() + sevenDaysMs

  const kvKey: string = `Ibby:IA-Auth-Key:${clientIp}`
  if ((await kv.set(kvKey, iaAuthKey, { pxat: expiresAtMS })) !== 'OK') {
    return NextResponse.json({}, { status: 500 })
  }

  cookies().set(constants.cookies.iaAuthKey, iaAuthKey, {
    expires: expiresAtMS,
    sameSite: 'strict',
    secure: true,
  })

  return NextResponse.json({ success: true })
}
