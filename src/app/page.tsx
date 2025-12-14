'use client'

import { useGenerationStore } from '@/lib/store'

export default function Home() {
  const { status, transcript, imageUrl, error, generate, reset } = useGenerationStore()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const prompt = event.currentTarget.elements.namedItem('prompt') as HTMLInputElement
    if (prompt) {
      generate(prompt.value)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ColorMagic</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="prompt"
          className="border p-2 mr-2"
          placeholder="Enter a prompt"
          disabled={status === 'generating'}
        />
        <button type="submit" className="bg-blue-500 text-white p-2" disabled={status === 'generating'}>
          {status === 'generating' ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {status === 'success' && imageUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Generated Image</h2>
          <img src={imageUrl} alt={transcript} className="mt-2 border" />
          <button onClick={reset} className="mt-2 bg-gray-500 text-white p-2">
            Start Over
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 text-red-500">
          <p>Error: {error}</p>
          <button onClick={reset} className="mt-2 bg-gray-500 text-white p-2">
            Try Again
          </button>
        </div>
      )}
    </main>
  )
}
