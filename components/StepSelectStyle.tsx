'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { HAIRSTYLES, CATEGORIES } from '@/lib/hairstyles'
import { fileToDataUrl } from '@/lib/imageUtils'
import type { Hairstyle } from '@/types'

interface Props {
  selectedStyle: Hairstyle | null
  referenceDataUrl: string | null
  onStyleSelect: (style: Hairstyle) => void
  onReferenceUpload: (dataUrl: string) => void
  onNext: () => void
  onBack: () => void
}

export default function StepSelectStyle({
  selectedStyle,
  referenceDataUrl,
  onStyleSelect,
  onReferenceUpload,
  onNext,
  onBack,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [tab, setTab] = useState<'gallery' | 'reference'>('gallery')
  const [search, setSearch] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = HAIRSTYLES.filter(h => {
    const matchCat = activeCategory === 'all' || h.category === activeCategory
    const q = search.trim().toLowerCase()
    const matchSearch = !q || h.nameVi.toLowerCase().includes(q) || h.name.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const handleRefFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    const dataUrl = await fileToDataUrl(file)
    onReferenceUpload(dataUrl)
  }, [onReferenceUpload])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleRefFile(file)
    e.target.value = ''
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleRefFile(file)
  }

  const canProceed =
    (tab === 'gallery' && selectedStyle !== null) ||
    (tab === 'reference' && referenceDataUrl !== null)

  return (
    <div className="fade-in flex flex-col gap-5 w-full max-w-md mx-auto">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-[#0A0A0A]">Chọn Kiểu Tóc</h2>
        <p className="text-sm text-gray-500 mt-1">Chọn từ thư viện hoặc upload ảnh tham khảo</p>
      </div>

      {/* Tab switcher */}
      <div className="flex border border-[#0A0A0A] rounded overflow-hidden">
        <button
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            tab === 'gallery'
              ? 'bg-[#0A0A0A] text-white'
              : 'bg-white text-[#0A0A0A] hover:bg-gray-50'
          }`}
          onClick={() => setTab('gallery')}
        >
          Thư Viện
        </button>
        <button
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            tab === 'reference'
              ? 'bg-[#0A0A0A] text-white'
              : 'bg-white text-[#0A0A0A] hover:bg-gray-50'
          }`}
          onClick={() => setTab('reference')}
        >
          Ảnh Thần Tượng
        </button>
      </div>

      {/* GALLERY TAB */}
      {tab === 'gallery' && (
        <>
          {/* Search input */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiểu tóc..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#F5A623]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-3 py-1 rounded text-xs font-semibold border transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#F5A623] border-[#F5A623] text-[#0A0A0A]'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-400">
              Không tìm thấy kiểu tóc nào cho &ldquo;{search}&rdquo;
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-3 gap-2">
            {filtered.map(style => (
              <button
                key={style.id}
                onClick={() => onStyleSelect(style)}
                className={`style-card aspect-[3/4] relative ${
                  selectedStyle?.id === style.id ? 'selected' : ''
                }`}
              >
                <Image
                  src={style.image}
                  alt={style.nameVi}
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized
                />
                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                  <p className="text-white text-[10px] font-semibold leading-tight">{style.nameVi}</p>
                </div>
                {/* Selected checkmark */}
                {selectedStyle?.id === style.id && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-[#F5A623] rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#0A0A0A" strokeWidth="2.5">
                      <polyline points="2 6 5 9 10 3"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {selectedStyle && (
            <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded p-3 flex items-center gap-3">
              <div className="relative w-10 h-10 rounded shrink-0 overflow-hidden">
                <Image src={selectedStyle.image} alt={selectedStyle.nameVi} fill className="object-cover" unoptimized />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A0A0A]">{selectedStyle.nameVi}</p>
                <p className="text-xs text-gray-500">{selectedStyle.name}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* REFERENCE TAB */}
      {tab === 'reference' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500 text-center">
            Upload ảnh thần tượng / người mẫu có kiểu tóc bạn muốn thử
          </p>

          <div
            className={`upload-zone ${referenceDataUrl ? 'has-image' : ''}`}
            onClick={() => !referenceDataUrl && fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
          >
            {referenceDataUrl ? (
              <div className="relative w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={referenceDataUrl}
                  alt="Reference"
                  className="w-full object-contain rounded"
                  style={{ maxHeight: '280px' }}
                />
                <button
                  onClick={e => { e.stopPropagation(); onReferenceUpload('') }}
                  className="absolute top-2 right-2 bg-[#0A0A0A] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  Upload ảnh tham khảo<br />
                  <span className="text-[#F5A623] font-semibold">chọn file</span>
                </p>
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

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Lưu ý:</span> AI sẽ học kiểu tóc từ ảnh này. Ảnh rõ tóc, không bị che khuất sẽ cho kết quả tốt hơn.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button className="btn-secondary flex-1" onClick={onBack}>← Quay Lại</button>
        <button className="btn-primary flex-1" disabled={!canProceed} onClick={onNext}>
          Tạo Ảnh →
        </button>
      </div>
    </div>
  )
}
