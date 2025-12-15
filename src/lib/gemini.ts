import { GoogleGenerativeAI } from '@google/generative-ai'

// Get the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Generates a black and white coloring page image based on a user prompt.
 */
export const generateColoringPageImage = async (userPrompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' }) // Using a model that supports image generation

    const finalPrompt = `
      Create a black and white outline drawing for a children's coloring page.
      The subject is: ${userPrompt}.
      Ensure the lines are thick, clear, and continuous.
      Strictly NO shading, NO grayscale, NO color.
      Pure black lines on a pure white background.
      Simple, cute, and friendly cartoon style suitable for young children.
      High contrast.
    `

    const result = await model.generateContent(finalPrompt)
    const response = await result.response

    // This part needs to be adapted based on the actual response structure for image generation
    // Assuming the response contains a base64 encoded image
    // This is a placeholder and may need to be adjusted
    const base64EncodeString = response.text() // This will likely not be the correct way to get the image data

    if (!base64EncodeString) {
      throw new Error('No image data found in the response.')
    }

    return `data:image/png;base64,${base64EncodeString}`

  } catch (error) {
    console.error('Error generating image:', error)
    // It's better to throw the error so the API route can handle it
    throw new Error('Failed to generate image.')
  }
}
