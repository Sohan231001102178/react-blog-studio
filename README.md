# Assignment 9: React Blog Application (CRUD)
> **Integration of React.js, Axios, and Mock REST API (JSON Server) with Validation**

---

## 1. Executive Summary & Core Requirements

This project delivers an end-to-end responsive Blog Application built with modern React.js, communicating with a `json-server` mock REST API.

| Requirement Category | Specification Detail | Implementation Strategy |
| :--- | :--- | :--- |
| **Media Support** | Posts contain text, image URLs, and embedded video URLs (YouTube/MP4). | Conditional media rendering inside responsive card previews via `MediaViewer.jsx`. |
| **Length Constraint** | Strict ceiling of 1,000 words per post content body. | Real-time client-side word count tokenizer (`trim().split(/\s+/).filter(Boolean).length`) and submission blocker via `useWordCount.js`. |
| **Mock REST API** | Persistent JSON Server endpoint serving a blogs array. | `json-server --watch db.json --port 5000` with Axios client configured in `blogService.js`. |
| **Search Feature** | Instant keyword filtering across post titles and bodies. | Controlled input with debounce and instant clearing trigger via `SearchBar.jsx`. |
| **State Feedback** | Informative visual states: loading, network failure, empty state. | Three distinct presentation states: `LoadingSpinner.jsx`, `ErrorNotice.jsx`, and Empty State Prompt in `BlogList.jsx`. |

---

## 2. Directory Hierarchy

```
react-blog-app/
├── db.json                     # JSON database served by json-server
├── package.json                # Project dependencies and startup scripts
├── vite.config.js              # Vite bundler configuration
├── index.html                  # HTML entry point with modern typography
├── presentation.html           # Standalone interactive browser presentation & live demo
├── src/
│   ├── api/
│   │   └── blogService.js      # Axios instance & centralized REST requests
│   ├── components/
│   │   ├── BlogCard.jsx        # Display card with actions (view, edit, delete)
│   │   ├── BlogForm.jsx        # Shared create/edit form with word limit validation
│   │   ├── BlogList.jsx        # Grid of blogs with empty & error fallbacks
│   │   ├── BlogDetailModal.jsx # Full-screen reader view with media preview
│   │   ├── SearchBar.jsx       # Controlled search input with clear trigger
│   │   ├── MediaViewer.jsx     # Handles responsive image rendering & iframe video
│   │   ├── LoadingSpinner.jsx  # Animated SVG loading indicator
│   │   └── ErrorNotice.jsx     # Styled error message box with retry trigger
│   ├── hooks/
│   │   ├── useBlogs.js         # Custom hook handling API state, fetch, delete
│   │   └── useWordCount.js     # Real-time word calculator & threshold evaluator
│   ├── App.jsx                 # Top-level state coordinator, routing/views
│   ├── index.css               # Global styles, variables, responsive design
│   └── main.jsx                # React application entry point
└── README.md                   # Project documentation & grading alignment
```

---

## 3. Quick Start & Execution Guide

### Prerequisites
- Node.js (v18+) & npm

### Installation
```bash
# Navigate to the project directory
cd react-blog-app

# Install dependencies
npm install
```

### Running the Application (Simultaneous Mock API & Frontend)
```bash
# Terminal 1: Launch json-server (Mock REST API) on port 5000
npm run server

# Terminal 2: Launch Vite React Development Server on port 3000
npm run dev
```

Alternatively, run both concurrently:
```bash
npm start
```

Open `http://localhost:3000` in your web browser.

---

## 4. Key Architectural Patterns

### A. Centralized Axios Service (`src/api/blogService.js`)
HTTP communication is isolated within a dedicated service layer:
- `getAll(searchQuery)`: Queries endpoint with optional keyword filtering.
- `getById(id)`: Fetches a single post for detail inspection.
- `create(blogData)`: Sends POST payload with auto-generated timestamps.
- `update(id, blogData)`: Sends PUT payload to update existing post.
- `remove(id)`: Sends DELETE request to eliminate post.
- Built-in intelligent fallback to local storage so the app remains fully demonstrable even if json-server is not running.

### B. Custom Hook Separation
- **`useWordCount(text, maxWords = 1000)`**:
  Tokenizes text by normalizing whitespace:
  ```js
  const count = text.trim().split(/\s+/).filter(Boolean).length;
  ```
  Returns `{ wordCount, isOverLimit, excessWords, percentage, remainingWords, isValid }`.
- **`useBlogs()`**:
  Manages REST operations, query caching, debounce timers, error states, and notification triggers.

### C. Responsive Media Embeds (`src/components/MediaViewer.jsx`)
- Automatically detects YouTube formats (`youtu.be`, `watch?v=`, `embed/`) and generates responsive 16:9 iframes.
- Renders HTML5 `<video>` for direct `.mp4` URLs.
- Provides fallback image placeholders on load errors.
