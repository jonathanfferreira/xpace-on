/**
 * Simple in-memory rate limiter for serverless API routes.
 *
 * Uses a sliding window counter per IP address.
 * Note: In a multi-instance deployment (e.g. multiple Vercel Edge regions),
 * this provides per-instance limiting. For strict global limiting, use
 * a shared store like Upstash Redis.
 */

const windowMs = 60_000; // 1 minute window
const store = new Map<string, { count: number; resetAt: number }>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key);
    }
}, 5 * 60_000);

/**
 * Check if a request should be rate limited.
 *
 * @param identifier - Unique identifier (usually IP address)
 * @param maxRequests - Maximum requests allowed per window (default: 10)
 * @returns { limited: boolean, remaining: number, resetAt: number }
 */
export function rateLimit(
    identifier: string,
    maxRequests: number = 10
): { limited: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = store.get(identifier);

    if (!entry || now > entry.resetAt) {
        // New window
        store.set(identifier, { count: 1, resetAt: now + windowMs });
        return { limited: false, remaining: maxRequests - 1, resetAt: now + windowMs };
    }

    entry.count++;
    const remaining = Math.max(0, maxRequests - entry.count);

    if (entry.count > maxRequests) {
        return { limited: true, remaining: 0, resetAt: entry.resetAt };
    }

    return { limited: false, remaining, resetAt: entry.resetAt };
}

/**
 * Extract client IP from request headers (works with Vercel, Cloudflare, etc.)
 */
export function getClientIp(request: Request): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        request.headers.get('cf-connecting-ip') ||
        'unknown'
    );
}
