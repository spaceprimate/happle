# Happle - Word Mixing Game

A fun React TypeScript application that creates new words by mixing halves of different words from your sentences!

## How It Works

1. **Enter a sentence** - Type any sentence in the input field
2. **Generate Happle Words** - Click the button to split each word in half and randomly recombine them
3. **Interactive Results** - Click on the generated "happle" words to interact with them

## Algorithm

The Happle word generation works by:
1. Splitting the input sentence into individual words
2. Dividing each word in half at the midpoint
3. Randomly shuffling the second halves of all words
4. Combining each first half with a randomly selected second half

## Features

- ✨ Modern, responsive UI with gradient styling
- 🎮 Interactive word buttons with hover effects
- 🔄 Real-time word generation
- 📱 Mobile-friendly design
- ⚡ Built with Vite for fast development

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd happle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Example

**Input:** "The quick brown fox jumps over the lazy dog"

**Possible Output:** "Thover", "quie", "browzy", "foxthe", "jumplaz", "oveps", "theick", "lazbrown", "dogy"

Each time you generate, you'll get different combinations!

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
