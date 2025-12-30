import { useSettingsStore } from '@/stores/settings'

interface ExtractedExpense {
    amount?: number
    date?: string
    description?: string
    category?: string
    paymentMethod?: string
}

export async function analyzeReceipt(file: File): Promise<ExtractedExpense> {
    const settingsStore = useSettingsStore()
    const apiKey = settingsStore.geminiApiKey

    if (!apiKey) {
        throw new Error('Chave da API do Gemini não configurada. Por favor, configure nas Configurações.')
    }

    const base64Image = await fileToBase64(file)

    // Remove header data:image/jpeg;base64, if present
    const base64Data = base64Image.split(',')[1]

    const prompt = `
    Analyze this receipt image and extract the following information in JSON format:
    - amount: number (the total amount paid)
    - date: string (in YYYY-MM-DD format)
    - description: string (a brief description of the purchase, e.g., store name)
    - category: string (map to one of: Moradia, Contas, Alimentação, Transporte, Lazer, Saúde, Viagem, Outros)
    - paymentMethod: string (guess based on context, one of: credit-card, debit-card, pix, cash, other. Default to debit-card if unsure)

    Return ONLY the JSON object, no markdown formatting.
  `

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: file.type,
                            data: base64Data
                        }
                    }
                ]
            }]
        })
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Erro ao analisar o comprovante')
    }

    const data = await response.json()

    try {
        const textContent = data.candidates[0].content.parts[0].text
        // Clean up potential markdown code blocks
        const jsonString = textContent.replace(/```json/g, '').replace(/```/g, '').trim()
        return JSON.parse(jsonString) as ExtractedExpense
    } catch (e) {
        console.error('Error parsing Gemini response:', e)
        throw new Error('Não foi possível extrair os dados do comprovante.')
    }
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
    })
}
