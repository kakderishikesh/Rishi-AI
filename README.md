# Rishi AI – Intelligent Portfolio Assistant

**Rishi AI** is a custom-built, interactive portfolio assistant that lets visitors, recruiters, and collaborators learn about my background, projects, and experiences through a conversational AI interface. It uses OpenAI's Assistants API (GPT-4o-mini) to deliver natural, topic-relevant responses and is fully integrated with a beautiful user friendly frontend UI.

### 🔗 [Live Demo](https://rishi-ai.vercel.app)

---

## Project Objective

To create a smart, human-like assistant that acts **as Rishikesh Kakde**, not just on his behalf — responding to queries about:

- Technical skills
- Academic background
- Work experience
- Projects and research
- Contact and portfolio details

All in a **concise, friendly, and professional tone**.

---

## ⚙️ Tech Stack

| Frontend               | Backend / API            | AI & Tools              | Analytics & Storage   |
|------------------------|--------------------------|-------------------------|------------------------|
| React + Vite           | Vercel Serverless API     | OpenAI Assistants API   | Supabase (Postgres)   |
| TailwindCSS            | Moderation Guardrails     | GPT-4o-mini                  | Chart.js + Supabase   |
| TypeScript             | Custom knowledge base     | RAG (Retrieval-Augmented) |                        |

---

## 🧩 Repository Structure

```
/frontend        --> UI for Rishi AI (React + Tailwind)
/frontend/api    --> Vercel serverless APIs (OpenAI + Logging)
/chatRishiAI     --> py file to chat with the assistant in terminal
```

---

## Features

### Conversational AI
- Hosted on OpenAI Assistants API (GPT-4o)
- Acts in Rishikesh’s voice and tone
- Retrieves from custom knowledge base
- Strips all citations (like `[4:0 Source]`) for cleaner UX

### UI Features
- Markdown rendering (with link highlighting and code formatting)
- Typing animation (word-by-word simulation)
- Fade-in animations for messages
- Sidebar with:
  - GitHub / LinkedIn / Website buttons
  - Medium blog link
  - Disclaimer for data usage

---

## Architecture

```
+------------+      +------------------+     +--------------------+
|   Frontend | ---> | Vercel API Layer | --> | OpenAI Assistant    |
|  (React UI)|      |   (FastAPI)      |     | (GPT-4o + RAG)      |
+------------+      +------------------+     +--------------------+
```

---

## Challenges & Fixes

| Problem | Fix |
|--------|-----|
| Citations like `[4:0 Source]` polluting responses | Server-side regex stripping before displaying and saving |
| Markdown links not clickable | Integrated `react-markdown` with custom `a` tag rendering |
| OpenAI moderation filtering user prompts | Used `/api/moderate.ts` and guardrails with fallback messages |
| Supabase logs misclassifying starter prompts | Added logic to check against valid prompts and assign accurately |
| Admin dashboard risk of exposure | Built as a separate local-only Vite app |
| Preview image not showing Open Graph | Customized `index.html` with Open Graph and Twitter meta tags |
| Vercel deployment failed to show previews | Fixed with `vercel.json` header rules and proper CDN hosting of image |
| Sidebar lacked branding | Added avatar, GitHub/LinkedIn buttons, and a disclaimer |

---

## Deployment Notes

- Frontend deployed on [Vercel](https://vercel.com)
- Serverless backend APIs hosted in `/api`

---

## Data Policy

Rishi AI may log anonymized user queries and responses for continuous improvement. Sensitive or unrelated queries are filtered using OpenAI's Moderation API and custom guardrails.

---

## 📬 Contact

- 📧 Email: rishikesh.kakde59@gmail.com
- 🌐 Website: [rishikeshkakde.framer.website](https://rishikeshkakde.framer.website)
- 💼 LinkedIn: [linkedin.com/in/rishikeshkakde](https://linkedin.com/in/rishikeshkakde)
- 🧠 Medium Blog: [Rishi AI Build](https://medium.com/@rkakde/how-i-built-my-alter-ego-in-artificial-intelligence-8259121a7fc5)
