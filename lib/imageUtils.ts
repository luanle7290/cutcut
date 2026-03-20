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

/** Convert public hairstyle image path → base64 via fetch */
export async function urlToBase64(
  imageUrl: string
): Promise<{ base64: string; mimeType: string }> {
  const res = await fetch(imageUrl)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(',')[1]
      const mimeType = blob.type || 'image/jpeg'
      resolve({ base64, mimeType })
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/** Trigger browser download of a base64 image */
export function downloadImage(dataUrl: string, filename = 'cutcut-result.jpg') {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}
