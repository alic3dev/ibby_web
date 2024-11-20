import 'server-only'

export type RateLimitProperty = Map<string, number>

export interface RateLimitCache<
  RateLimitCachePropertyValue = RateLimitProperty,
> {
  messages: RateLimitCachePropertyValue
  login: RateLimitCachePropertyValue
}

export const ratelimit: RateLimitCache = {
  messages: new Map<string, number>(),
  login: new Map<string, number>(),
}

export interface IAAuthCacheValue {
  value: string
  expiresAt: number
}

export interface IAAuthCache {
  [kvKey: string]: IAAuthCacheValue
}

export const iaAuth: IAAuthCache = {}

export interface SLAuthCacheValue {
  S418: string
  eX21: number
}

export interface SLAuthCache {
  [ip: string]: SLAuthCacheValue
}

export const slAuth: SLAuthCache = {}
