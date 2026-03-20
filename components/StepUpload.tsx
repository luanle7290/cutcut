'use client'

import { useRef, useState, useCallback } from 'react'
import { fileToDataUrl } from '@/lib/imageUtils'

interface Props {
  selfieDataUrl: string | null
  onSelfieChange: (dataUrl: string) => void
  onNext: () => void
}

export default function StepUpload({ selfieDataUrl, onSelfieChange, onNext }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [mode, setMode] = useState<'idle' | 'camera'>('idle')
  const [cameraError, setCameraError] = useState<string | null>(null)

  // --- File upload ---
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    const dataUrl = await fileToDataUrl(file)
    onSelfieChange(dataUrl)
  }, [onSelfieChange])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  // --- Drag & drop ---
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  // --- Camera ---
  const startCamera = async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      setMode('camera')
      // Wait for video element to mount
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      }, 50)
    } catch {
      setCameraError('Không thể truy cập camera. Vui lòng cấp quyền hoặc dùng upload ảnh.')
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setMode('idle')
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    // Mirror the image (selfie-mode)
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    onSelfieChange(dataUrl)
    stopCamera()
  }

  return (
    <div className="fade-in flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-[#0A0A0A]">Ảnh Của Bạn</h2>
        <p className="text-sm text-gray-500 mt-1">Chụp ảnh hoặc tải ảnh selfie lên</p>
      </div>

      {/* Camera view */}
      {mode === 'camera' ? (
        <div className="w-full flex flex-col items-center gap-3">
          <div className="relative w-full rounded overflow-hidden bg-black aspect-[3/4]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-3 w-full">
            <button className="btn-secondary flex-1" onClick={stopCamera}>Hủy</button>
            <button className="btn-primary flex-1" onClick={capturePhoto}>
              Chụp Ảnh
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Upload zone */}
          <div
            className={`upload-zone w-full ${selfieDataUrl ? 'has-image' : ''}`}
            onClick={() => !selfieDataUrl && fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
          >
            {selfieDataUrl ? (
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selfieDataUrl}
                  alt="Selfie preview"
                  className="w-full object-contain rounded"
                  style={{ maxHeight: '340px' }}
                />
                <button
                  onClick={e => { e.stopPropagation(); onSelfieChange('') }}
                  className="absolute top-2 right-2 bg-[#0A0A0A] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-600"
                  title="Xóa ảnh"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  Kéo thả ảnh vào đây<br />
                  hoặc <span className="text-[#F5A623] font-semibold">chọn file</span>
                </p>
                <p className="text-xs text-gray-400">JPG, PNG, WEBP — tối đa 10MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileChange}
          />

          {/* Camera button */}
          {!selfieDataUrl && (
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">hoặc</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          )}

          {!selfieDataUrl && (
            <button className="btn-secondary w-full flex items-center justify-center gap-2" onClick={startCamera}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Chụp Bằng Camera
            </button>
          )}

          {cameraError && (
            <p className="text-xs text-red-500 text-center">{cameraError}</p>
          )}
        </>
      )}

      {/* Tip */}
      <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded p-3 w-full">
        <p className="text-xs text-[#0A0A0A]">
          <span className="font-semibold">Mẹo:</span> Ảnh rõ mặt, ánh sáng tốt, nhìn thẳng vào camera sẽ cho kết quả đẹp nhất.
        </p>
      </div>

      {/* Next button */}
      <button
        className="btn-primary w-full"
        disabled={!selfieDataUrl}
        onClick={onNext}
      >
        Tiếp Theo →
      </button>
    </div>
  )
}
