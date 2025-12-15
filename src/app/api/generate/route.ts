import { NextResponse } from 'next/server'
import { generateColoringPageImage } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const imageUrl = await generateColoringPageImage(prompt)

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
