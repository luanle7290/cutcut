'use client'

import { useState, useCallback } from 'react'
import StepUpload from '@/components/StepUpload'
import StepSelectStyle from '@/components/StepSelectStyle'
import StepResult from '@/components/StepResult'
import { compressImage, urlToBase64 } from '@/lib/imageUtils'
import type { AppStep, AppState, Hairstyle } from '@/types'

const INITIAL_STATE: AppState = {
  step: 'upload',
  selfieDataUrl: null,
  selectedStyle: null,
  referenceDataUrl: null,
  resultDataUrl: null,
  isLoading: false,
  error: null,
}

const STEP_ORDER: AppStep[] = ['upload', 'select', 'result']

export default function Home() {
  const [state, setState] = useState<AppState>(INITIAL_STATE)

  const update = (patch: Partial<AppState>) =>
    setState(prev => ({ ...prev, ...patch }))

  // ---- Navigation ----
  const goTo = (step: AppStep) => update({ step, error: null })

  const currentStepIndex = STEP_ORDER.indexOf(state.step)

  // ---- Step 1 → 2 ----
  const handleSelfieChange = (dataUrl: string) => {
    update({ selfieDataUrl: dataUrl || null, resultDataUrl: null })
  }

  // ---- Step 2 → 3: trigger generate ----
  const handleGenerate = useCallback(async () => {
    if (!state.selfieDataUrl) return

    update({ step: 'result', isLoading: true, error: null, resultDataUrl: null })

    try {
      // Compress selfie
      const { base64: selfieBase64, mimeType: selfieMime } =
        await compressImage(state.selfieDataUrl)

      // Get style image — gallery or user-uploaded reference
      let styleBase64: string
      let styleMime: string

      if (state.selectedStyle) {
        const result = await urlToBase64(state.selectedStyle.image)
        styleBase64 = result.base64
        styleMime = result.mimeType
      } else if (state.referenceDataUrl) {
        const result = await compressImage(state.referenceDataUrl)
        styleBase64 = result.base64
        styleMime = result.mimeType
      } else {
        throw new Error('Vui lòng chọn kiểu tóc trước.')
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selfieBase64,
          selfieMime,
          styleBase64,
          styleMime,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error ?? `Lỗi server: ${res.status}`)
      }

      update({ resultDataUrl: data.imageBase64, isLoading: false })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.'
      update({ isLoading: false, error: message })
    }
  }, [state.selfieDataUrl, state.selectedStyle, state.referenceDataUrl])

  const handleRetry = () => handleGenerate()

  const handleBackToSelect = () => goTo('select')

  const handleReset = () => setState(INITIAL_STATE)

  return (
    <main className="min-h-screen bg-[#F9F9F9] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A0A0A] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={handleReset} className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-tight">
            Cut<span className="text-[#F5A623]">Cut</span>
          </span>
          <span className="text-xs text-gray-400 font-medium">AI Hair Studio</span>
        </button>
      </header>

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
          {STEP_ORDER.map((step, idx) => {
            const isDone = idx < currentStepIndex
            const isActive = idx === currentStepIndex
            return (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`
                    flex items-center justify-center rounded-full text-xs font-bold
                    transition-all duration-300
                    ${isActive ? 'w-7 h-7 bg-[#F5A623] text-[#0A0A0A]' : ''}
                    ${isDone ? 'w-7 h-7 bg-[#0A0A0A] text-white' : ''}
                    ${!isActive && !isDone ? 'w-7 h-7 border-2 border-gray-200 text-gray-400' : ''}
                  `}
                >
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="2 6 5 9 10 3"/>
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    isActive ? 'text-[#0A0A0A]' : isDone ? 'text-gray-500' : 'text-gray-300'
                  }`}
                >
                  {step === 'upload' ? 'Ảnh Selfie' : step === 'select' ? 'Kiểu Tóc' : 'Kết Quả'}
                </span>
                {idx < STEP_ORDER.length - 1 && (
                  <div className={`w-8 h-px ${idx < currentStepIndex ? 'bg-[#0A0A0A]' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {state.step === 'upload' && (
          <StepUpload
            selfieDataUrl={state.selfieDataUrl}
            onSelfieChange={handleSelfieChange}
            onNext={() => goTo('select')}
          />
        )}

        {state.step === 'select' && (
          <StepSelectStyle
            selectedStyle={state.selectedStyle}
            referenceDataUrl={state.referenceDataUrl}
            onStyleSelect={(style: Hairstyle) =>
              update({ selectedStyle: style, referenceDataUrl: null })
            }
            onReferenceUpload={(dataUrl: string) =>
              update({ referenceDataUrl: dataUrl || null, selectedStyle: null })
            }
            onNext={handleGenerate}
            onBack={() => goTo('upload')}
          />
        )}

        {state.step === 'result' && (
          <StepResult
            selfieDataUrl={state.selfieDataUrl!}
            resultDataUrl={state.resultDataUrl}
            selectedStyle={state.selectedStyle}
            referenceDataUrl={state.referenceDataUrl}
            isLoading={state.isLoading}
            error={state.error}
            onRetry={handleRetry}
            onBack={handleBackToSelect}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-100">
        CutCut AI Hair Studio © {new Date().getFullYear()}
      </footer>
    </main>
  )
}
