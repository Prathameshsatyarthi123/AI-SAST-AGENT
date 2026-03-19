🛡️ AI SAST Code Scanning Agent

An AI-powered Static Application Security Testing (SAST) tool that analyzes Python code for security vulnerabilities — combining LLM intelligence with Semgrep's rule-based scanning engine.

Show Image Show Image Show Image Show Image Show Image

📌 What is this?
As AI-generated code becomes the norm, security vulnerabilities are shipping faster than ever. This tool acts as an AI security agent — it takes your Python source code, runs it through multiple scanning layers, and returns a detailed vulnerability report with CVSS scores, vulnerable code snippets, and recommended fixes.
Tech stack:

Frontend — React + Next.js 15 (TypeScript)
Backend — FastAPI + Python 3.12
AI Engine — Groq API (LLaMA 3.1)
Static Scanner — Semgrep SAST
Containerization — Docker (single container, multi-stage build)


🏗️ Architecture
┌─────────────────────────────────────────────┐
│                  Browser                     │
│         Next.js Frontend (Port 3000)         │
└──────────────────┬──────────────────────────┘
                   │ HTTP POST /api/analyze
┌──────────────────▼──────────────────────────┐
│           FastAPI Backend (Port 8000)        │
│  ┌─────────────────┐  ┌───────────────────┐ │
│  │   Groq LLaMA    │  │     Semgrep       │ │
│  │  (AI Analysis)  │  │  (SAST Scanning)  │ │
│  └─────────────────┘  └───────────────────┘ │
└─────────────────────────────────────────────┘

🚀 Quick Start
Prerequisites

Docker installed and running
Git installed
A Groq API key (free)
A Semgrep account and API token (free)


Step 1 — Clone the Repository
bashgit clone https://github.com/Prathameshsatyarthi123/AI-SAST-AGENT.git
cd AI-SAST-AGENT

Step 2 — Set Up Semgrep
Semgrep is the static analysis engine powering the rule-based vulnerability scanner.

Go to https://semgrep.dev and click "Try Semgrep for free"
Sign in with GitHub
Once logged in, navigate to Settings → Tokens (bottom-left of dashboard)
Click "Create New Token" with these settings:

Name: cyber-analyzer (or any name)
Scopes: ✅ Agent (CI) and ✅ Web API


Click Create — copy the token immediately, it won't be shown again

Your token will look like: eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...

Step 3 — Get a Groq API Key

Go to https://console.groq.com
Sign up or log in
Navigate to API Keys and click Create API Key
Copy the key — it starts with gsk_...


Step 4 — Configure Environment Variables
In the project root, create a .env file:
bash# Create the .env file
touch .env
Add the following content:
envGROQ_API_KEY=gsk_your_groq_key_here
SEMGREP_APP_TOKEN=your_semgrep_token_here

⚠️ Security Note: The .env file is listed in .gitignore — it will never be committed. Never share these keys publicly.


Step 5 — Build and Run with Docker
bash# Build the Docker image
docker build -t ai-sast-agent .

# Run the container
docker run --rm --name ai-sast-agent -p 8000:8000 --env-file .env ai-sast-agent
Open your browser and navigate to:
http://localhost:8000

🖥️ Usage

Open the app in your browser
Click "Open .py file" and select any Python file
Click "▶ RUN SCAN"
View the security report:

Executive summary
Severity breakdown (Critical / High / Medium / Low)
Each vulnerability with CVSS score, vulnerable code, and recommended fix




📁 Project Structure
AI-SAST-AGENT/
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Main page
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── globals.css    # Global styles
│   │   ├── components/
│   │   │   ├── CodeInput.tsx       # File upload + code viewer
│   │   │   └── AnalysisResults.tsx # Vulnerability report UI
│   │   └── types/
│   │       └── security.ts    # TypeScript types
│   ├── package.json
│   └── next.config.ts
├── backend/                   # FastAPI application
│   ├── server.py              # Main API server
│   ├── context.py             # Prompt engineering helpers
│   ├── pyproject.toml         # Python dependencies
│   └── uv.lock
├── Dockerfile                 # Multi-stage Docker build
├── .env                       # API keys (not committed)
├── .gitignore
└── README.md

🔌 API Reference
POST /api/analyze
Analyzes Python code for security vulnerabilities.
Request body:
json{
  "code": "your python code string here"
}
Response:
json{
  "summary": "Executive summary of findings...",
  "issues": [
    {
      "title": "SQL Injection vulnerability",
      "description": "Detailed description...",
      "code": "vulnerable_code_snippet()",
      "fix": "safe_replacement_code()",
      "cvss_score": 8.5,
      "severity": "high"
    }
  ]
}
GET /health
Returns API status.

🌍 Deploying to EC2
bash# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Clone, configure, build, and run
git clone https://github.com/Prathameshsatyarthi123/AI-SAST-AGENT.git
cd AI-SAST-AGENT
echo "GROQ_API_KEY=your_key" >> .env
echo "SEMGREP_APP_TOKEN=your_token" >> .env
docker build -t ai-sast-agent .
docker run -d --name ai-sast-agent -p 8000:8000 --env-file .env ai-sast-agent
Make sure port 8000 is open in your EC2 Security Group inbound rules.

🔮 Extending to Other Languages
This agent currently supports Python, but Semgrep supports many more languages. To add support for another language, update the file upload filter and the analysis prompt in context.py:
LanguageSemgrep SupportFile ExtensionJavaScript / TypeScript✅ Full.js, .tsJava✅ Full.javaGo✅ Full.goRuby✅ Full.rbPHP✅ Full.phpC / C++✅ Full.c, .cppRust✅ Full.rsKotlin✅ Full.kt

🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

📄 License
MIT License — see LICENSE for details.

👨‍💻 Author
Built by Prathamesh Satyarthi
