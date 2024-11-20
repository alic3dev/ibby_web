import type { IAAuthCacheValue } from '@/utils/server/caches'

import 'server-only'

import type { ServerRuntime } from 'next'
import type { NextRequest } from 'next/server'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'
import { createKysely } from '@vercel/postgres-kysely'
import { Generated } from 'kysely'

import * as caches from '@/utils/server/caches'

export const runtime: ServerRuntime = 'nodejs'

const ratelimit: { [type: string]: Ratelimit } = {
  messages: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(100, '10 s'),
    ephemeralCache: caches.ratelimit.messages,
    prefix: '@upstash/ratelimit/ibby_messages',
  }),
}

const totalMessages: number = 233976

export const POST = async (req: NextRequest) => {
  const clientIp: string =
    req.ip ||
    req.headers.get('X-Real-IP') ||
    req.headers.get('X-Forwarded-For')?.replace(/\s/g, '').split(',').pop() ||
    '127.0.0.1'

  if (!(await ratelimit.messages.limit(clientIp)).success) {
    return NextResponse.json({}, { status: 429 })
  }

  const iaAuthKey = cookies().get('IA-Auth-Key')

  if (!iaAuthKey) {
    return NextResponse.json({}, { status: 401 })
  }

  const kvKey: string = `Ibby:IA-Auth-Key:${clientIp}`
  const storedIAAuthKey: IAAuthCacheValue | undefined = caches.iaAuth[kvKey]
  let storedIAAuthKeyValue: string | undefined = storedIAAuthKey?.value
  let storedIAAuthKeyExpiresAt: number | undefined = storedIAAuthKey?.expiresAt

  if (
    !storedIAAuthKey ||
    !storedIAAuthKeyValue ||
    Date.now() <= storedIAAuthKeyExpiresAt
  ) {
    storedIAAuthKeyValue = (await kv.get(kvKey)) ?? undefined

    if (storedIAAuthKeyValue) {
      storedIAAuthKeyExpiresAt = await kv.ttl(kvKey)

      caches.iaAuth[kvKey] = {
        value: storedIAAuthKeyValue,
        expiresAt: storedIAAuthKeyExpiresAt,
      }
    }
  }

  if (iaAuthKey.value !== storedIAAuthKeyValue || !storedIAAuthKeyValue) {
    return NextResponse.json({}, { status: 401 })
  }

  const db = createKysely<Database.Alic3Dev>()
  let data

  try {
    data = await db
      .selectFrom('ibby_messages')
      .select([
        'ibby_messages.id',
        'ibby_messages.candidate_id',
        'ibby_messages.chat_id',
        'ibby_messages.create_time',
        'ibby_messages.raw_content',
      ])
      .where(
        'ibby_messages.id',
        '=',
        Math.floor(
          Math.random() * totalMessages + 1,
        ) as unknown as Generated<number>,
      )
      .executeTakeFirst()
  } catch (err) {
    console.error(err)
  } finally {
    db.destroy()
  }

  return NextResponse.json({ success: typeof data !== 'undefined', data })
}
