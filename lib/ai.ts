/**
 * AI abstraction layer — uses Google GenAI SDK (new) with gemini-2.0-flash-exp.
 * gemini-2.0-flash-exp supports: image input + image output (free tier).
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

  const { GoogleGenAI } = await import('@google/genai')
  const ai = new GoogleGenAI({ apiKey })

  const prompt = `You are a professional hairstylist AI.
Apply the exact hairstyle shown in Image 2 to the person in Image 1.
Keep the person's face, skin tone, and facial features exactly the same.
Only change the hair — style, length, and texture should match Image 2.
Return a photorealistic result. The output should look like a natural photo.`

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
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
        ],
      },
    ],
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  })

  const parts = response.candidates?.[0]?.content?.parts

  if (!parts) throw new Error('Gemini trả về kết quả rỗng')

  // Find image part in response
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith('image/')) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
    }
  }

  throw new Error(
    'Gemini chưa hỗ trợ tạo ảnh trong khu vực này. Vui lòng thử lại sau.'
  )
}
