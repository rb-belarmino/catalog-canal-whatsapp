import crypto from 'crypto'
import { cookies } from 'next/headers'
import { logger } from '@/shared/logger'

const COOKIE_NAME = 'admin_session'
// 10 years in seconds (effectively permanent until explicit logout)
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET environment variable is not defined')
  }
  return secret
}

function getExpectedPassword(): string {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    throw new Error('ADMIN_PASSWORD environment variable is not defined')
  }
  return password
}

/**
 * Creates a signed session token: timestamp.signature
 */
export function createSessionToken(): string {
  const issuedAt = Date.now().toString()
  const secret = getSecret()
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(issuedAt)
    .digest('hex')
  return `${issuedAt}.${hmac}`
}

/**
 * Validates a session token using constant-time comparison
 */
export function verifySessionToken(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [issuedAt, receivedHmac] = parts
  try {
    const secret = getSecret()
    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(issuedAt)
      .digest('hex')

    const receivedBuf = Buffer.from(receivedHmac, 'hex')
    const expectedBuf = Buffer.from(expectedHmac, 'hex')

    if (receivedBuf.length !== expectedBuf.length) return false
    return crypto.timingSafeEqual(receivedBuf, expectedBuf)
  } catch (err) {
    logger.error('AdminAuth', 'Error verifying session token', {
      err: String(err)
    })
    return false
  }
}

/**
 * Verifies if input password matches ADMIN_PASSWORD using constant-time check
 */
export function verifyAdminPassword(inputPassword: string): boolean {
  try {
    const expectedPassword = getExpectedPassword()
    const inputBuf = Buffer.from(inputPassword, 'utf8')
    const expectedBuf = Buffer.from(expectedPassword, 'utf8')

    if (inputBuf.length !== expectedBuf.length) return false
    return crypto.timingSafeEqual(inputBuf, expectedBuf)
  } catch (err) {
    logger.error('AdminAuth', 'Error verifying admin password', {
      err: String(err)
    })
    return false
  }
}

/**
 * Checks if current request has a valid admin session cookie
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return verifySessionToken(token)
}

/**
 * Sets the permanent admin session cookie
 */
export async function setAdminSessionCookie(): Promise<void> {
  const token = createSessionToken()
  const cookieStore = await cookies()

  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE
  })
}

/**
 * Clears the admin session cookie upon explicit logout
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
