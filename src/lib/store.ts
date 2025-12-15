import { create } from 'zustand'

interface GenerationState {
  status: 'idle' | 'generating' | 'success' | 'error'
  transcript: string
  imageUrl: string | null
  error: string | null
  generate: (prompt: string) => Promise<void>
  reset: () => void
}

export const useGenerationStore = create<GenerationState>((set) => ({
  status: 'idle',
  transcript: '',
  imageUrl: null,
  error: null,
  generate: async (prompt) => {
    set({ status: 'generating', transcript: prompt, error: null })
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const { imageUrl } = await response.json()
      set({ status: 'success', imageUrl })
    } catch (error: any) {
      set({ status: 'error', error: error.message || 'Failed to generate image' })
    }
  },
  reset: () => set({ status: 'idle', transcript: '', imageUrl: null, error: null }),
}))
