import { NextRequest, NextResponse } from 'next/server'
import { generateHairstyle } from '@/lib/ai'

// Max 30s for Gemini image gen
export const maxDuration = 30

// Simple in-memory rate limiter: max 5 requests per IP per 60s window
// Note: resets on cold start (best-effort for serverless)
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000
const ipTimestamps = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const times = (ipTimestamps.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  if (times.length >= RATE_LIMIT) return false
  times.push(now)
  ipTimestamps.set(ip, times)
  // Cleanup old IPs periodically
  if (ipTimestamps.size > 500) {
    Array.from(ipTimestamps.entries()).forEach(([key, val]) => {
      if (val.every(t => now - t >= RATE_WINDOW_MS)) ipTimestamps.delete(key)
    })
  }
  return true
}

// Max ~3MB per base64 string (≈ 2.25MB decoded)
const MAX_BASE64_BYTES = 3 * 1024 * 1024

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Bạn đã tạo quá nhiều ảnh. Vui lòng chờ 1 phút rồi thử lại.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const { selfieBase64, selfieMime, styleBase64, styleMime } = body

    if (!selfieBase64 || !styleBase64) {
      return NextResponse.json(
        { error: 'Thiếu ảnh selfie hoặc ảnh kiểu tóc.' },
        { status: 400 }
      )
    }

    if (!selfieMime?.startsWith('image/') || !styleMime?.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Định dạng ảnh không hợp lệ.' },
        { status: 400 }
      )
    }

    // File size guard
    if (selfieBase64.length > MAX_BASE64_BYTES || styleBase64.length > MAX_BASE64_BYTES) {
      return NextResponse.json(
        { error: 'Ảnh quá lớn. Vui lòng dùng ảnh nhỏ hơn 2MB.' },
        { status: 413 }
      )
    }

    const imageBase64 = await generateHairstyle({
      selfieBase64,
      selfieMime,
      styleBase64,
      styleMime,
    })

    return NextResponse.json({ imageBase64 })
  } catch (err: unknown) {
    console.error('[/api/generate]', err)
    const message =
      err instanceof Error ? err.message : 'Lỗi không xác định từ AI.'
    // Surface quota/billing errors clearly
    const isQuota = message.toLowerCase().includes('quota') || message.toLowerCase().includes('429')
    return NextResponse.json(
      { error: isQuota ? 'Hệ thống đang bận, vui lòng thử lại sau vài giây.' : message },
      { status: 500 }
    )
  }
}
