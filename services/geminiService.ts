import { GoogleGenAI } from "@google/genai";

/**
 * Generates a black and white coloring page image based on a user prompt.
 * Uses the gemini-3-pro-image-preview model for high quality.
 */
export const generateColoringPageImage = async (userPrompt: string): Promise<string> => {
  // Initialize the client inside the function to ensure it uses the most up-to-date 
  // API key from process.env.API_KEY, which may have been updated by the key selection dialog.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Prompt engineering to ensure the output is a coloring page suitable for children
    const finalPrompt = `
      Create a black and white outline drawing for a children's coloring page. 
      The subject is: ${userPrompt}. 
      Ensure the lines are thick, clear, and continuous. 
      Strictly NO shading, NO grayscale, NO color. 
      Pure black lines on a pure white background. 
      Simple, cute, and friendly cartoon style suitable for young children.
      High contrast.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", // Portrait mode, good for printing
          imageSize: "1K"
        },
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64EncodeString = part.inlineData.data;
          // Determine mime type, default to png if not present (though usually is)
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64EncodeString}`;
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
