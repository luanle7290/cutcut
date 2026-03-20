/**
 * AI abstraction layer — swap models here without touching API route.
 * Currently uses Gemini 2.5 Flash Image Preview (free tier, 500 images/day).
 * Phase 2: swap to Fal.ai for higher quality.
 */

export interface GenerateHairstyleParams {
  selfieBase64: string   // pure base64 (no data: prefix)
  selfieMime: string     // e.g. "image/jpeg"
  styleBase64: string    // pure base64
  styleMime: string
}

export async function generateHairstyle(
  params: GenerateHairstyleParams
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(apiKey)

  // gemini-2.5-flash-preview-05-20 supports image output (500 images/day free)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-preview-05-20',
    generationConfig: {
      // @ts-expect-error — responseModalities not yet typed in SDK but required for image output
      responseModalities: ['TEXT', 'IMAGE'],
    },
  })

  const prompt = `You are a professional hairstylist AI.
Apply the exact hairstyle shown in Image 2 to the person in Image 1.
Keep the person's face, skin tone, and facial features exactly the same.
Only change the hair — style, length, and texture should match Image 2.
Return a photorealistic result. The output should look like a natural photo.`

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: params.selfieMime,
        data: params.selfieBase64,
      },
    },
    {
      inlineData: {
        mimeType: params.styleMime,
        data: params.styleBase64,
      },
    },
  ])

  const response = result.response
  const parts = response.candidates?.[0]?.content?.parts

  if (!parts) throw new Error('Gemini trả về kết quả rỗng')

  // Find image part in response
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith('image/')) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
    }
  }

  // Fallback: if Gemini returns text description instead of image
  // (happens when image generation is not available in the region)
  throw new Error(
    'Gemini chưa hỗ trợ tạo ảnh trong khu vực này. Vui lòng thử lại sau.'
  )
}
