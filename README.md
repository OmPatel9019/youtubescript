# Extract YouTube Script

**Extract transcripts from YouTube videos. Clean them up, navigate timestamps, and export them in multiple formats.**

Extract YouTube Script is a web-based micro-tool designed for students, researchers, content creators, and anyone who needs to turn YouTube video content into reusable text.

🔗 **Live Demo:** https://extractyoutubescript.com

---

## ✨ Features

- **Fast Transcript Extraction** — Retrieve available video transcripts through YouTube API integration.
- **AI-Powered Audio Transcription Fallback** — Provide an alternative transcription path when supported caption extraction is unavailable.
- **Interactive Timestamps** — Navigate transcript segments and jump to corresponding points in the video.
- **Transcript Cleanup** — Remove unwanted introductory or sponsor segments using the available trimming utilities.
- **Multiple Export Formats** — Download transcripts as TXT, SRT, VTT, Markdown, or JSON.
- **Multilingual Workflows** — Support transcript translation workflows for users working with different languages.
- **Responsive Interface** — Access the tool through a modern web interface.
- **Cloudflare Deployment and Protection** — Deliver the application through Cloudflare infrastructure.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend framework | Astro.js |
| UI library | React |
| Styling | Tailwind CSS |
| UI components | shadcn/ui |
| Backend | Node.js |
| Transcript integration | YouTube API |
| Fallback transcription | AI-powered audio transcription |
| Deployment and protection | Cloudflare |

## 🚀 How It Works

1. **Enter a YouTube URL** — Provide the video you want to transcribe.
2. **Extract the transcript** — The application attempts to retrieve available transcript data.
3. **Process the content** — Review the transcript, navigate timestamps, and use available cleanup utilities.
4. **Export your transcript** — Download the result in your preferred format.

If the normal transcript retrieval path is unavailable, the application can use its AI-powered audio transcription fallback when supported.

## 📂 Supported Export Formats

| Format | Typical Use Case |
|---|---|
| TXT | Plain-text notes and research |
| SRT | Subtitles with timestamps |
| VTT | Web video captions |
| Markdown | Documentation and structured notes |
| JSON | Structured data and further processing |

## 💻 Built With a Product-First Approach

This project was an opportunity to work on a real, deployed web application rather than just a static portfolio interface.

Key areas explored include:

- Integrating third-party APIs into a web application.
- Handling asynchronous backend operations.
- Managing external-service failures and alternative processing paths.
- Building reusable frontend components.
- Supporting multiple output formats.
- Deploying a publicly accessible application with Cloudflare.

## 🧪 Testing and Reliability

Reliability is important for tools that depend on external services.

Areas to validate include:

- Invalid or unsupported YouTube URLs.
- Videos without accessible transcripts.
- Failures during fallback transcription.
- Timestamp preservation and export formatting.
- API errors, request timeouts, and usage limits.

*Add your actual automated testing framework, test coverage, and verified performance measurements here as these become available.*

## 🔒 Security and Privacy

The application uses Cloudflare infrastructure for deployment and protection.

API credentials should be stored in environment variables and kept out of client-side code and version control. Requests to external services should be validated, and applicable rate limits should be enforced.

Review the application's privacy policy for details about data handling and retention.

## 🌐 Try It

**Start using Extract YouTube Script:**

https://extractyoutubescript.com

## 👨‍💻 About the Developer

I'm a Computer Engineering graduate interested in full-stack development, practical software engineering, and building useful web applications.

I built Extract YouTube Script to explore API integration, asynchronous processing, frontend development, and deploying a real-world micro-tool.

I'm open to **Junior Software Engineer, Junior Full-Stack Developer, and Node.js Developer opportunities**.

---

⭐ If you find this project useful, consider starring the repository and sharing your feedback.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```


| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## ⚙️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) — use a version compatible with your project.
- npm (included with Node.js) or your project's package manager.
- Git.

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

Replace the placeholders with your actual GitHub repository URL and directory name.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the appropriate project directory and add the environment variables required by your application.

Example:

```env
YOUTUBE_API_KEY=your_youtube_api_key
AI_TRANSCRIPTION_API_KEY=your_ai_api_key
```

These are illustrative variable names. Use the exact names expected by your source code, and only configure the keys required by your implementation.

**Important:** Never commit your `.env` file or expose private API keys in frontend code. Add `.env` to `.gitignore`.

### 4. Start the Development Server

For an Astro application, the usual command is:

```bash
npm run dev
```

Open the local URL printed in your terminal, commonly:

```text
http://localhost:4321
```

If your backend runs as a separate Node.js service, open another terminal and start it using the backend's configured development script.

For example:

```bash
npm run dev
```

Run this second command from the backend directory only if its `package.json` defines that script.

### 5. Build for Production

To build the Astro frontend:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

For a separate Node.js backend, follow its own build and start scripts if applicable.

### Troubleshooting

- **Missing environment variables:** Check that your `.env` file contains the variable names expected by the application.
- **Port already in use:** Stop the other process or configure a different port.
- **Transcript extraction fails:** Verify your API configuration, video accessibility, service limits, and backend logs.
- **Dependency errors:** Check your Node.js version and follow the repository's lockfile and package-manager conventions.
