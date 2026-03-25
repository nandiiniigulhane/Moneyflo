# Moneyflo 💸

> **Financial clarity, every day.**  
> A lightweight personal finance tracker - simple, fast, and user-focused.

---

## Overview

Moneyflo is a JavaScript-based expense tracker that lets users securely log in, set a monthly income, create custom spending categories, and track expenses in real time with data stored in Firebase.

---

## Features

- **Authentication** — secure login & registration using Firebase Auth
- **Cloud storage** — user data (income, categories, transactions) stored in Firebase Firestore
- **Monthly income setup** — set once, edit any time
- **Custom categories** — create your own (Food, Travel, EMI, etc.)
- **Expense logging** — amount, description, category, and date
- **Live stats** — income, total spent, and remaining balance update instantly
- **Transaction cards** — all logged expenses displayed dynamically
- **Delete transactions** — removes the entry and recalculates your stats

---

## Getting Started

No build step required. Just serve the files from any static file server.

### Option 1 — VS Code Live Server

1. Open the project folder in VS Code
2. Right-click `index.html` → **Open with Live Server**

### Option 2 — Python

```bash
python -m http.server 8000
then open: http://localhost:8000
```
