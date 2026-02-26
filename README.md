# What To Cook — Frontend

The frontend for the "What To Cook" app. A chat-style interface where you can ask an AI assistant to help you figure out what to cook.

**Live:** [cook-assistant-beryl.vercel.app](https://cook-assistant-beryl.vercel.app)

---

## What it does

- Type a meal name and get the ingredients and instructions
- Add your ingredients and get meal suggestions with autocomplete
- Hit "Surprise me" and let the AI pick something for you

---

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS v4
- Vercel

---

## Running locally

You need Node.js 18+.
```bash
git clone https://github.com/khatteli-Wassim/wtc-frontend.git
cd wtc-frontend

npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the dev server:
```bash
npm run dev
```

Runs at `http://localhost:3000`

---
