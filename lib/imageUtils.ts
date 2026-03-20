/**
 * Compress image to max 1024px on longest side before sending to Gemini.
 * Runs in browser only.
 */
export async function compressImage(
  dataUrl: string,
  maxPx = 1024,
  quality = 0.85
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const { width, height } = img
      let targetW = width
      let targetH = height

      if (width > maxPx || height > maxPx) {
        if (width >= height) {
          targetW = maxPx
          targetH = Math.round((height / width) * maxPx)
        } else {
          targetH = maxPx
          targetW = Math.round((width / height) * maxPx)
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, targetW, targetH)

      const compressed = canvas.toDataURL('image/jpeg', quality)
      const base64 = compressed.split(',')[1]
      resolve({ base64, mimeType: 'image/jpeg' })
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

/** Read file as base64 data URL */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** Convert public hairstyle image path → base64 JPEG via canvas (handles SVG too) */
export async function urlToBase64(
  imageUrl: string
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const w = img.naturalWidth || 300
      const h = img.naturalHeight || 400
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      resolve({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' })
    }
    img.onerror = reject
    img.src = imageUrl
  })
}

/** Trigger browser download of a base64 image */
export function downloadImage(dataUrl: string, filename = 'cutcut-result.jpg') {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}
