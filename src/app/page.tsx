'use client'

import { useGenerationStore } from '@/lib/store'
import VoiceControl from '@/components/VoiceControl'
import { useEffect, useState } from 'react'

export default function Home() {
  const store = useGenerationStore()
  const [transcript, setTranscript] = useState('')

  useEffect(() => {
    if (transcript) {
      store.generate(transcript)
    }
  }, [transcript, store.generate])


  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ColorMagic</h1>

      <VoiceControl onTranscript={setTranscript} state={store} />

      {store.status === 'generating' && <p>Generating...</p>}

      {store.status === 'success' && store.imageUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Generated Image</h2>
          <img src={store.imageUrl} alt={store.transcript} className="mt-2 border" />
          <button onClick={store.reset} className="mt-2 bg-gray-500 text-white p-2">
            Start Over
          </button>
        </div>
      )}

      {store.status === 'error' && (
        <div className="mt-4 text-red-500">
          <p>Error: {store.error}</p>
          <button onClick={store.reset} className="mt-2 bg-gray-500 text-white p-2">
            Try Again
          </button>
        </div>
      )}
    </main>
  )
}
