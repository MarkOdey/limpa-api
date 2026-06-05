# limpa-api

Backend API for the Limpa cleaning booking platform. Built with Node.js (ESM), Hapi.js, MongoDB, Firebase Auth, and Stripe Connect.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 20 | Use `nvm use` — version pinned in `.nvmrc` |
| Docker & Docker Compose | Latest | Required for the full local stack |
| MongoDB | 7 | Provided via Docker Compose |
| Firebase CLI | Latest | Only needed if running the emulator outside Docker |

---

## Quick Start (Docker — recommended)

The full local stack (API + MongoDB + Firebase Auth emulator) runs with a single command.

```bash
cp .env.example .env
docker compose up --build
```

| Service | URL |
|---------|-----|
| API | http://localhost:3000 |
| Firebase Auth emulator | http://localhost:9099 |
| Firebase Emulator UI | http://localhost:4000 |
| MongoDB | mongodb://localhost:27017/limpa |

The API container mounts `./src` and runs with `node --watch`, so code changes are picked up without a rebuild.

---

## Local Setup (without Docker)

### 1. Install dependencies

```bash
nvm use
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values:

```
MONGO_URI=mongodb://localhost:27017/limpa

# Firebase — use the emulator for local dev (see below)
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIREBASE_PROJECT_ID=demo-limpa

# Or use a real Firebase project:
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_CLIENT_EMAIL=your-service-account@...
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PLATFORM_FEE_RATE=0.005
```

### 3. Start the Firebase Auth emulator

```bash
npm install -g firebase-tools
firebase emulators:start --only auth --project demo-limpa
```

The emulator UI is available at http://localhost:4000. You can create test users there without a real Firebase account.

### 4. Start the API

```bash
npm run dev
```

---

## Firebase Auth — Local vs Production

| Mode | How it works |
|------|-------------|
| `FIREBASE_AUTH_EMULATOR_HOST` is set | API uses the local emulator — no real Firebase credentials needed |
| `FIREBASE_AUTH_EMULATOR_HOST` is unset | API validates tokens against real Firebase using the service account credentials |

When using the emulator, set `FIREBASE_PROJECT_ID=demo-limpa` (any `demo-*` project ID works without real credentials).

---

## Running Tests

```bash
npm test               # run all tests once
npm run test:watch     # watch mode
npm run test:coverage  # with coverage report
```

Tests use Vitest with all external dependencies mocked (Mongoose models, Firebase Admin, Stripe). No running database or Firebase instance is required.

---

## Project Structure

```
src/
├── server.js           # Hapi server entry point
├── config.js           # Env-based configuration
├── plugins/
│   ├── mongodb.js      # Mongoose connection plugin
│   └── firebaseAdmin.js # Firebase Admin + JWT auth scheme
├── models/             # Mongoose schemas (Client, Cleaner, Location, …)
├── routes/
│   ├── auth.js
│   ├── client/         # Client-facing endpoints
│   └── cleaner/        # Cleaner-facing endpoints
└── services/
    ├── fcm.js          # Firebase Cloud Messaging helpers
    └── stripe.js       # Stripe Connect + billing helpers

tests/
├── helpers/server.js   # Test server factory (mocked auth)
├── routes/             # Route handler unit tests
└── services/           # Service unit tests
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | HTTP port |
| `HOST` | No | `0.0.0.0` | Bind address |
| `MONGO_URI` | Yes | — | MongoDB connection string |
| `FIREBASE_AUTH_EMULATOR_HOST` | No | — | Set to use local emulator |
| `FIREBASE_PROJECT_ID` | Yes | — | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Prod only | — | Service account email |
| `FIREBASE_PRIVATE_KEY` | Prod only | — | Service account private key |
| `STRIPE_SECRET_KEY` | Yes | — | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | — | Stripe webhook signing secret |
| `PLATFORM_FEE_RATE` | No | `0.005` | Platform cut as a decimal (0.5%) |
