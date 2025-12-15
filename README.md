# ColorMagic

ColorMagic is a Next.js application that uses the Google Gemini API to generate coloring pages from user prompts. This project was refactored from a monolithic TypeScript application to a more scalable and secure architecture with a distinct frontend and backend.

## Features

-   **Next.js Frontend**: A modern, responsive user interface for displaying status and images.
-   **Next.js Backend**: Secure API routes for handling logic and external connections.
-   **Google Gemini API Integration**: Connects to the Gemini API to generate high-quality coloring pages.
-   **Voice Control**: Use your voice to generate coloring pages.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/colormagic.git
    cd colormagic
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Configuration

1.  Create a `.env.local` file in the root of the project:
    ```bash
    touch .env.local
    ```
2.  Add your Google Gemini API key to the `.env.local` file:
    ```
    GEMINI_API_KEY=your-api-key
    ```

### Running the Application

To start the development server, run the following command:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the code.
-   `npm test`: Runs all tests.
-   `npm run test:frontend`: Runs the frontend tests.
-   `npm run test:backend`: Runs the backend tests.
