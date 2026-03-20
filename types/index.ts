export type AppStep = 'upload' | 'select' | 'result'

export interface Hairstyle {
  id: string
  name: string
  nameVi: string
  image: string   // path under /public/hairstyles/
  category: 'short' | 'medium' | 'long' | 'curly' | 'straight' | 'wavy'
}

export interface GenerateRequest {
  selfieBase64: string    // base64 data URL
  styleBase64: string     // base64 data URL  (gallery or uploaded)
  mimeType: string        // image/jpeg | image/png | image/webp
}

export interface GenerateResponse {
  imageBase64: string     // base64 data URL of result
  error?: string
}

export interface AppState {
  step: AppStep
  selfieDataUrl: string | null
  selectedStyle: Hairstyle | null
  referenceDataUrl: string | null  // user-uploaded reference photo
  resultDataUrl: string | null
  isLoading: boolean
  error: string | null
}
