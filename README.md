<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Developer Snippet Vault & AI Publisher

Store, search, and organize code snippets with Gemini AI auto-tagging, summaries, and Markdown technical documentation publishing.

## 🚀 Quick Start

**Prerequisites:** Node.js (v18+)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Add your Gemini API key in [`.env.local`](.env.local):
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```
   *(Note: The app will run with fallback mock responses if no key is provided.)*

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Available Scripts

- `npm run dev` - Starts the full-stack server (Express + Vite) on port 3000
- `npm run build` - Bundles the React frontend with Vite for production
- `npm run preview` - Previews the production build
- `npm run start` - Runs the application server
- `npm run lint` - Runs TypeScript type-checking without emitting files
- `npm run clean` - Cleans build output directories

---

## 🌟 Key Features

- **Snippet Vault:** Multi-language code snippet manager with search, tagging, favorites, and collections.
- **AI-Powered Code Analysis:** Gemini integration for auto-summaries, code explanation, and improvement suggestions.
- **AI Documentation Publisher:** Generates README sections, API guides, and tutorial writeups from code snippets.
- **Interactive REST API Explorer:** Built-in interactive documentation and OpenAPI 3.0 specification (`/api/openapi.json`).
- **Offline / Standalone Fallbacks:** Fully functional even without an API key configured.
