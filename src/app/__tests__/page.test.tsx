import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import Home from '../page'
import { useGenerationStore } from '@/lib/store'

// Mock the VoiceControl component
jest.mock('@/components/VoiceControl', () => {
  return jest.fn(({ onTranscript }) => (
    <button onClick={() => onTranscript('a cute cat')}>Mock Voice Control</button>
  ))
})

// Mock the store
const mockGenerate = jest.fn()
const mockReset = jest.fn()

// Set up a consistent initial state for the store
const initialStoreState = {
  status: 'idle' as const,
  transcript: '',
  imageUrl: null,
  error: null,
  generate: mockGenerate,
  reset: mockReset,
}

describe('Home page', () => {
  beforeEach(() => {
    // Reset mocks and store state before each test
    jest.clearAllMocks()
    act(() => {
      useGenerationStore.setState(initialStoreState)
    })
  })

  it('renders the initial state correctly', () => {
    render(<Home />)
    expect(screen.getByText('ColorMagic')).toBeInTheDocument()
    expect(screen.getByText('Mock Voice Control')).toBeInTheDocument()
  })

  it('calls generate when the voice control provides a transcript', async () => {
    render(<Home />)
    const voiceControlButton = screen.getByText('Mock Voice Control')

    fireEvent.click(voiceControlButton)

    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalledWith('a cute cat')
    })
  })

  it('displays the generated image on success', async () => {
    render(<Home />)

    act(() => {
      useGenerationStore.setState({
        status: 'success',
        transcript: 'a cute cat',
        imageUrl: 'data:image/png;base64,mock-image-data',
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Generated Image')).toBeInTheDocument()
      expect(screen.getByAltText('a cute cat')).toBeInTheDocument()
      expect(screen.getByText('Start Over')).toBeInTheDocument()
    })
  })

  it('displays an error message on failure', async () => {
    render(<Home />)

    act(() => {
      useGenerationStore.setState({
        status: 'error',
        error: 'Failed to generate',
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to generate')).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  it('calls reset when the reset button is clicked', async () => {
    render(<Home />)

    act(() => {
      useGenerationStore.setState({
        status: 'success',
        imageUrl: 'data:image/png;base64,mock-image-data',
      })
    })

    await waitFor(() => {
      fireEvent.click(screen.getByText('Start Over'))
    })

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalled()
    })
  })
})
