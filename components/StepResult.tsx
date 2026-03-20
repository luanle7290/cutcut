'use client'

import { useState } from 'react'
import { downloadImage } from '@/lib/imageUtils'
import type { Hairstyle } from '@/types'

interface Props {
  selfieDataUrl: string
  resultDataUrl: string | null
  selectedStyle: Hairstyle | null
  referenceDataUrl: string | null
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onBack: () => void
  onReset: () => void
}

export default function StepResult({
  selfieDataUrl,
  resultDataUrl,
  selectedStyle,
  referenceDataUrl,
  isLoading,
  error,
  onRetry,
  onBack,
  onReset,
}: Props) {
  const styleName = selectedStyle?.nameVi ?? 'Kiểu Tóc Tuỳ Chỉnh'
  const styleThumb = selectedStyle?.image ?? referenceDataUrl ?? null

  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')

  const handleSave = () => {
    if (resultDataUrl) {
      downloadImage(resultDataUrl, `cutcut-${selectedStyle?.id ?? 'custom'}.jpg`)
    }
  }

  const handleShare = async () => {
    if (!resultDataUrl) return
    // Convert data URL to Blob for native share
    const res = await fetch(resultDataUrl)
    const blob = await res.blob()
    const file = new File([blob], `cutcut-${selectedStyle?.id ?? 'custom'}.jpg`, { type: blob.type })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'CutCut AI Hair Studio' })
        return
      } catch {
        // user cancelled or share failed — fall through to copy link
      }
    }
    // Fallback: copy page URL to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    } catch {
      // clipboard not available, silent fail
    }
  }

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="fade-in flex flex-col items-center gap-6 w-full max-w-md mx-auto py-8">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-[#0A0A0A]">Đang Tạo Ảnh...</h2>
          <p className="text-sm text-gray-500 mt-1">AI đang thử kiểu tóc cho bạn</p>
        </div>

        {/* Before / After preview while loading */}
        <div className="flex gap-3 w-full">
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">Gốc</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selfieDataUrl} alt="Selfie" className="w-full aspect-[3/4] object-cover rounded opacity-60" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">Kết Quả</p>
            <div className="w-full aspect-[3/4] bg-gray-100 rounded flex items-center justify-center overflow-hidden relative">
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              <div className="spinner" />
            </div>
          </div>
        </div>

        {/* Animated progress steps */}
        <div className="w-full flex flex-col gap-2">
          {[
            { label: 'Phân tích ảnh selfie', delay: '0ms' },
            { label: 'Học kiểu tóc từ ảnh mẫu', delay: '600ms' },
            { label: 'Tạo ảnh kết quả', delay: '1200ms' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 opacity-0 animate-stepIn" style={{ animationDelay: step.delay, animationFillMode: 'forwards' }}>
              <div className="w-5 h-5 rounded-full border-2 border-[#F5A623] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse" />
              </div>
              <p className="text-xs text-gray-600">{step.label}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center">Vui lòng không đóng trang này</p>
      </div>
    )
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="fade-in flex flex-col items-center gap-6 w-full max-w-md mx-auto py-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-[#0A0A0A]">Có Lỗi Xảy Ra</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xs">{error}</p>
        </div>

        <div className="flex gap-3 w-full">
          <button className="btn-secondary flex-1" onClick={onBack}>← Đổi Kiểu</button>
          <button className="btn-primary flex-1" onClick={onRetry}>Thử Lại</button>
        </div>
      </div>
    )
  }

  // --- Result state ---
  return (
    <div className="fade-in flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-[#0A0A0A]">Kết Quả</h2>
        <p className="text-sm text-gray-500 mt-1">
          {styleName} — trông thật tuyệt!
        </p>
      </div>

      {/* Before & After */}
      <div className="flex gap-3 w-full">
        <div className="flex-1 flex flex-col gap-1">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">Trước</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selfieDataUrl}
            alt="Before"
            className="w-full aspect-[3/4] object-cover rounded border border-gray-200"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <p className="text-xs text-[#F5A623] font-semibold uppercase tracking-wider text-center">Sau ✨</p>
          {resultDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resultDataUrl}
              alt="After"
              className="w-full aspect-[3/4] object-cover rounded border-2 border-[#F5A623]"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
              <p className="text-xs text-gray-400">Không có ảnh</p>
            </div>
          )}
        </div>
      </div>

      {/* Style used */}
      {styleThumb && (
        <div className="flex items-center gap-3 w-full bg-gray-50 border border-gray-200 rounded p-3">
          <p className="text-xs text-gray-500">Kiểu tóc đã chọn:</p>
          <p className="text-sm font-semibold text-[#0A0A0A]">{styleName}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full pt-1">
        {resultDataUrl && (
          <div className="flex gap-3">
            <button className="btn-primary flex-1 flex items-center justify-center gap-2" onClick={handleSave}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Lưu Ảnh
            </button>
            <button className="btn-secondary flex items-center justify-center gap-2 px-4" onClick={handleShare} title="Chia sẻ">
              {shareStatus === 'copied' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              )}
              <span className="text-xs">{shareStatus === 'copied' ? 'Đã Copy!' : 'Chia Sẻ'}</span>
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={onBack}>
            ← Đổi Kiểu
          </button>
          <button className="btn-secondary flex-1" onClick={onReset}>
            Ảnh Mới
          </button>
        </div>
      </div>
    </div>
  )
}
