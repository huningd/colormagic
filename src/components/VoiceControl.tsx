'use client'

import { useEffect, useState, useRef } from 'react'
import { Mic, MicOff, RotateCw } from 'lucide-react'
import { useGenerationStore } from '@/lib/store'

interface VoiceControlProps {
  onTranscript: (text: string) => void;
  state: ReturnType<typeof useGenerationStore>;
}

const VoiceControl = ({ onTranscript, state }: VoiceControlProps) => {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('')
        onTranscript(transcript)
      }

      recognitionRef.current = recognition
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={toggleListening}
        className={`p-4 rounded-full ${
          isListening ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}
      >
        {isListening ? <MicOff /> : <Mic />}
      </button>
      {state.status === 'generating' && (
        <div className="ml-4">
          <RotateCw className="animate-spin" />
        </div>
      )}
    </div>
  )
}

export default VoiceControl
