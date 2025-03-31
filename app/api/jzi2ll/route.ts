import 'server-only'

import type { UUID } from 'crypto'
import type { ServerRuntime } from 'next'

import type { ExtendedNextRequest } from '@/types/next'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'
import seedrandom from 'seedrandom'

import * as ssh from 'ssh2'

import * as constants from '@/app/constants'
import * as caches from '@/utils/server/caches'

const AZvj: string[] = []

if (process.env.ZHIWL) {
  try {
    const nvzlk: unknown = JSON.parse(process.env.ZHIWL)

    if (
      Array.isArray(nvzlk) &&
      !nvzlk.find((v: unknown): boolean => typeof v !== 'string')
    ) {
      AZvj.push(...nvzlk)
    }
  } catch {}
}

const pubKeys: string[] = [...AZvj]

const allowedKeys: ssh.ParsedKey[] = pubKeys
  .map((key: string): ssh.ParsedKey | Error => ssh.utils.parseKey(key))
  .filter(
    (key: ssh.ParsedKey | Error): boolean => !(key instanceof Error),
  ) as ssh.ParsedKey[]

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

function zWEf109(zjvl2: string): seedrandom.PRNG {
  if (!caches.slAuth[zjvl2] || caches.slAuth[zjvl2].eX21 <= Date.now()) {
    caches.slAuth[zjvl2] = {
      S418: crypto.randomUUID(),
      eX21: Date.now() + 8.64e7,
    }
  }

  const baseValue: number = Date.now() / 1000
  const reducedVal: number =
    baseValue - (baseValue - Math.floor(baseValue / 30) * 30)

  return seedrandom(`${reducedVal}:${caches.slAuth[zjvl2].S418}`)
}

const VNZKJZ: string =
  '0123456789%^&*()_-+{}[]|;:/?.>,<QWERTYUIOPASDFGHJKLZXCVBNMqwertyuioplkjhgfdsazxcvbnm'

function ZXZJSL(alsdk: string): string {
  const zjkvl: seedrandom.PRNG = zWEf109(alsdk)

  const vznkl: number = 128

  return new Array(vznkl)
    .fill(0)
    .map(() => VNZKJZ[Math.floor(VNZKJZ.length * zjkvl())])
    .join('')
}

export const GET = async (req: ExtendedNextRequest) => {
  const vjzk: string =
    req.ip ||
    req.headers.get('X-Real-IP') ||
    req.headers.get('X-Forwarded-For')?.replace(/\s/g, '').split(',').pop() ||
    '127.0.0.1'

  return NextResponse.json({
    lp2589: ZXZJSL(vjzk),
    success: true,
  })
}

export const POST = async (req: ExtendedNextRequest) => {
  const zvnlqewr: string =
    req.ip ||
    req.headers.get('X-Real-IP') ||
    req.headers.get('X-Forwarded-For')?.replace(/\s/g, '').split(',').pop() ||
    '127.0.0.1'

  if (!(await ratelimit.login.limit(zvnlqewr)).success) {
    return NextResponse.json({}, { status: 429 })
  }

  let qpot: string = ''

  try {
    const parsedBody: { qpot: string } = await req.json()

    if (parsedBody && typeof parsedBody === 'object') {
      qpot = parsedBody.qpot
    }
  } catch {}

  if (!qpot || typeof qpot !== 'string') {
    return NextResponse.json({}, { status: 400 })
  }

  const ZVJK = Buffer.from(qpot, 'hex')
  const AGUIO = Buffer.from(qpot, 'base64')
  const zkvln: string = ZXZJSL(zvnlqewr)

  if (
    !allowedKeys.find(
      (key: ssh.ParsedKey): boolean =>
        key.verify(zkvln, ZVJK) || key.verify(zkvln, AGUIO),
    )
  ) {
    return NextResponse.json({}, { status: 401 })
  }

  const iaAuthKey: UUID = crypto.randomUUID() as UUID
  const expiresAtMS: number = Date.now() + sevenDaysMs

  const kvKey: string = `Ibby:IA-Auth-Key:${zvnlqewr}`
  if ((await kv.set(kvKey, iaAuthKey, { pxat: expiresAtMS })) !== 'OK') {
    return NextResponse.json({}, { status: 500 })
  }

  (await cookies()).set(constants.cookies.iaAuthKey, iaAuthKey, {
    expires: expiresAtMS,
    sameSite: 'strict',
    secure: true,
  })

  return NextResponse.json({ success: true })
}
