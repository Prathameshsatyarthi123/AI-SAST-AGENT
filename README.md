# 🛡️ AI SAST Code Scanning Agent

**An AI-powered Static Application Security Testing tool that analyzes Python code for security vulnerabilities — combining LLM intelligence with Semgrep's rule-based scanning engine.**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![Semgrep](https://img.shields.io/badge/Semgrep-SAST-FF6B35?style=flat)](https://semgrep.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

---

## 📌 Overview

As AI-generated code becomes the norm, security vulnerabilities are shipping faster than ever. This tool acts as an **AI security agent** — upload a Python file, and it returns a full vulnerability report with CVSS scores, the exact vulnerable code, and recommended fixes.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Next.js 15 (TypeScript) |
| Backend | FastAPI + Python 3.12 |
| AI Engine | Groq API — LLaMA 3.1 |
| Static Scanner | Semgrep SAST |
| Container | Docker (multi-stage build) |

---

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Browser / Frontend    │
│   Next.js (Port 3000)   │
└────────────┬────────────┘
             │  POST /api/analyze
┌────────────▼────────────┐
│   FastAPI Backend       │
│     (Port 8000)         │
│                         │
│  ┌─────────┐ ┌────────┐ │
│  │  Groq   │ │Semgrep │ │
│  │ LLaMA   │ │  SAST  │ │
│  └─────────┘ └────────┘ │
└─────────────────────────┘
```

---

## 🚀 Setup Guide

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed and running
- [Git](https://git-scm.com/) installed
- A [Groq API key](https://console.groq.com) — free
- A [Semgrep](https://semgrep.dev) account and API token — free

---

### 1. Clone the Repository

```bash
git clone https://github.com/Prathameshsatyarthi123/AI-SAST-AGENT.git
cd AI-SAST-AGENT
```

---

### 2. Set Up Semgrep

Semgrep is the static analysis engine that powers the rule-based vulnerability scanner.

1. Visit [semgrep.dev](https://semgrep.dev) → click **"Try Semgrep for free"**
2. Sign in with **GitHub**
3. Go to **Settings → Tokens** (bottom-left of the dashboard)
4. Click **"Create New Token"** with these settings:

   | Field | Value |
   |-------|-------|
   | Name | `cyber-analyzer` |
   | Scopes | ✅ Agent (CI) + ✅ Web API |

5. Click **Create** and **copy the token immediately** — it won't be shown again

> Your token will look like: `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...`

---

### 3. Get a Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to **API Keys** → click **Create API Key**
4. Copy the key — it starts with `gsk_...`

---

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
touch .env
```

Add your keys:

```env
GROQ_API_KEY=gsk_your_groq_key_here
SEMGREP_APP_TOKEN=your_semgrep_token_here
```

> ⚠️ **Security Note:** `.env` is in `.gitignore` and will never be committed. Never share these keys publicly.

---

### 5. Build and Run with Docker

```bash
# Build the image
docker build -t ai-sast-agent .

# Run the container
docker run --rm --name ai-sast-agent -p 8000:8000 --env-file .env ai-sast-agent
```

Then open your browser at:

```
http://localhost:8000
```

---

## 🖥️ How to Use

1. Open the app in your browser
2. Click **"Open .py file"** and select any Python source file
3. Click **"▶ RUN SCAN"**
4. View your security report:
   - Executive summary
   - Severity breakdown — Critical / High / Medium / Low
   - Each vulnerability with CVSS score, vulnerable code snippet, and fix

---

## 📁 Project Structure

```
AI-SAST-AGENT/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Main page
│   │   │   ├── layout.tsx          # Root layout
│   │   │   └── globals.css         # Global styles
│   │   ├── components/
│   │   │   ├── CodeInput.tsx       # File upload + code viewer
│   │   │   └── AnalysisResults.tsx # Vulnerability report UI
│   │   └── types/
│   │       └── security.ts         # TypeScript types
│   └── package.json
├── backend/
│   ├── server.py                   # FastAPI server
│   ├── context.py                  # Prompt engineering helpers
│   └── pyproject.toml              # Python dependencies
├── Dockerfile                      # Multi-stage build
├── .env                            # API keys (not committed)
└── README.md
```

---

## 🔌 API Reference

### `POST /api/analyze`

Analyze Python code for security vulnerabilities.

**Request**
```json
{
  "code": "your python source code here"
}
```

**Response**
```json
{
  "summary": "Executive summary of findings...",
  "issues": [
    {
      "title": "SQL Injection vulnerability",
      "description": "User input passed directly to query...",
      "code": "cursor.execute('SELECT * FROM users WHERE id=' + user_id)",
      "fix": "cursor.execute('SELECT * FROM users WHERE id=?', (user_id,))",
      "cvss_score": 8.5,
      "severity": "high"
    }
  ]
}
```

### `GET /health`

Returns API health status.

---

YOU CAN DEPLOY THIS AGENT TO ANY CONTAINER SUPPORT SERVICE. HERE IS GENERAL DEMO OF DEPLOYING IT TO SIMPLE EC2(LINUX) INSTANCE

## ☁️ Deploy to AWS EC2

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-public-ip

# Clone and configure
git clone https://github.com/Prathameshsatyarthi123/AI-SAST-AGENT.git
cd AI-SAST-AGENT

# Add your keys
echo "GROQ_API_KEY=your_key" >> .env
echo "SEMGREP_APP_TOKEN=your_token" >> .env

# Build and run
docker build -t ai-sast-agent .
docker run -d --name ai-sast-agent -p 8000:8000 --env-file .env ai-sast-agent
```

> Make sure **port 8000** is open in your EC2 Security Group inbound rules (`0.0.0.0/0`, TCP).

---

## 🌍 Extend to Other Languages

This agent currently supports **Python**. Since Semgrep supports many languages, extending is straightforward — update the file filter and analysis prompt in `context.py`.

| Language | Semgrep Support | Extensions |
|----------|:--------------:|------------|
| JavaScript / TypeScript | ✅ | `.js` `.ts` `.tsx` |
| Java | ✅ | `.java` |
| Go | ✅ | `.go` |
| Ruby | ✅ | `.rb` |
| PHP | ✅ | `.php` |
| C / C++ | ✅ | `.c` `.cpp` |
| Rust | ✅ | `.rs` |
| Kotlin | ✅ | `.kt` |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 👨‍💻 Author

Built by [Prathamesh Satyarthi](https://github.com/Prathameshsatyarthi123)

---


