import { POST } from '../route'
import { NextResponse } from 'next/server'
import { generateColoringPageImage } from '@/lib/gemini'

// Mock the gemini library
jest.mock('@/lib/gemini', () => ({
  generateColoringPageImage: jest.fn(),
}))

describe('/api/generate', () => {
  it('should return an image URL on success', async () => {
    const mockImageUrl = 'data:image/png;base64,mock-image-data'
    ;(generateColoringPageImage as jest.Mock).mockResolvedValue(mockImageUrl)

    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: 'a cute cat' }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ imageUrl: mockImageUrl })
  })

  it('should return a 400 error if prompt is missing', async () => {
    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({ error: 'Prompt is required' })
  })

  it('should return a 500 error on failure', async () => {
    ;(generateColoringPageImage as jest.Mock).mockRejectedValue(new Error('Failed to generate'))

    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: 'a cute cat' }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body).toEqual({ error: 'Failed to generate image' })
  })
})
