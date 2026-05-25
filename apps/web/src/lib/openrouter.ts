/**
 * OpenRouter API integration utility
 * Using OpenRouter for free AI API access
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: ChatMessage
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
  }
}

export const SYSTEM_PROMPT = `Kamu adalah "aiRMADA Data Analyst AI", seorang AI analyst ahli dalam industri logistik dan armada kendaraan.

Tugas utamamu:
1. INSIGHT ARMADA: Analisis data armada untuk memberikan insight berharga tentang kondisi operasional
2. DETEKSI ABNORMAL: Identifikasi kendaraan dengan performa abnormal, konsumsi bahan bakar tinggi, atau maintenance issue
3. REKOMENDASI MAINTENANCE: Berikan rekomendasi maintenance predictive dan preventive based on data patterns
4. ANALISIS EFISIENSI: Analisis efisiensi rute, waktu tempuh, dan penggunaan resource
5. KOMUNIKASI SIMPEL: Jelaskan semua insight dengan bahasa yang mudah dipahami, gunakan bahasa Indonesia

Gaya Komunikasi:
- Gunakan data konkret dari file yang di-upload
- Berikan angka dan persentase yang jelas
- Buatkan summary actionable items di akhir analisis
- Gunakan tone profesional tapi friendly
- Highlight masalah kritis dengan alert yang jelas

Format Response:
- Mulai dengan summary ringkas (1-2 paragraf)
- Breakdown detail dengan bullets/angka
- Berikan rekomendasi konkret
- Tampilkan data-driven insights

Kamu memiliki akses ke data armada yang berisi:
- Informasi kendaraan (tipe, tahun, kondisi)
- Data operasional (km, bahan bakar, maintenance history)
- Rute dan waktu tempuh
- Driver performance
- Maintenance records

Selalu:
✓ Prioritaskan keselamatan dan compliance
✓ Fokus pada efisiensi cost
✓ Beri warning untuk issue urgent
✓ Tawarkan solusi praktis
✗ Jangan membuat klaim tanpa data
✗ Jangan recommend action tanpa reasoning
`

export async function chatWithAnalyst(
  messages: ChatMessage[],
  model: string = 'mistralai/mistral-7b-instruct:free'
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://airmada.app',
        'X-Title': 'aiRMADA Data Analyst',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenRouter API error: ${error.message || response.statusText}`)
    }

    const data: OpenRouterResponse = await response.json()
    const assistantMessage = data.choices[0]?.message?.content

    if (!assistantMessage) {
      throw new Error('No response content from OpenRouter')
    }

    return assistantMessage
  } catch (error) {
    console.error('OpenRouter API error:', error)
    throw error
  }
}

export async function analyzeFleetData(
  fileContent: string,
  fileName: string,
  query?: string
): Promise<string> {
  const userMessage = query
    ? `Saya telah upload file "${fileName}" berisi data armada. ${query}`
    : `Saya telah upload file "${fileName}" berisi data armada. Mohon lakukan analisis menyeluruh terhadap data ini dan berikan insights, alert untuk issue kritis, serta rekomendasi untuk improvement.`

  const messages: ChatMessage[] = [
    {
      role: 'user',
      content: `File: ${fileName}\n\nData:\n${fileContent}\n\n${userMessage}`,
    },
  ]

  return chatWithAnalyst(messages)
}

export async function streamChatWithAnalyst(
  messages: ChatMessage[],
  model: string = 'mistralai/mistral-7b-instruct:free'
) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://airmada.app',
      'X-Title': 'aiRMADA Data Analyst',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.9,
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`)
  }

  return response.body
}
