import { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory rate limit storage (use Redis in production for multi-instance deployments)
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime?: number;
}

/**
 * Rate limiting middleware
 *
 * @param request - Next.js request object
 * @param limit - Maximum number of requests allowed in the time window
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result with allowed status and remaining requests
 */
export function rateLimit(
  request: NextRequest,
  limit: number = 10,
  windowMs: number = 60000,
): RateLimitResult {
  // Get client IP from various headers (Vercel, CloudFlare, standard)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // No record or expired window - create new record
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
    };
  }

  // Rate limit exceeded
  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  return {
    allowed: true,
    remaining: limit - record.count,
  };
}

/**
 * Get human-readable time until rate limit reset
 */
export function getResetTimeSeconds(resetTime: number): number {
  return Math.ceil((resetTime - Date.now()) / 1000);
}
