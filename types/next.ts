import type { NextRequest } from 'next/server'

export interface ExtendedNextRequest extends NextRequest {
  ip?: string
}

