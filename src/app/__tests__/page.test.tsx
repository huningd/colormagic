import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import Home from '../page'
import { useGenerationStore } from '@/lib/store'

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
    expect(screen.getByPlaceholderText('Enter a prompt')).toBeInTheDocument()
    expect(screen.getByText('Generate')).toBeInTheDocument()
  })

  it('calls generate when the form is submitted', async () => {
    render(<Home />)
    const input = screen.getByPlaceholderText('Enter a prompt')
    const form = input.closest('form')!

    fireEvent.change(input, { target: { value: 'a cute dog' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalledWith('a cute dog')
    })
  })

  it('displays the generated image on success', async () => {
    render(<Home />)

    act(() => {
      useGenerationStore.setState({
        status: 'success',
        transcript: 'a cute dog',
        imageUrl: 'data:image/png;base64,mock-image-data',
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Generated Image')).toBeInTheDocument()
      expect(screen.getByAltText('a cute dog')).toBeInTheDocument()
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
