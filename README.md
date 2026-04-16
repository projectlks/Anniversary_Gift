# Anniversary Gift (Multi-User, Admin Managed)

Romantic couple web app built with Next.js + Prisma + PostgreSQL.

## Core Features

- Magic link sign-in (Auth.js + Resend)
- Super admin dashboard
- Admin-only CRUD for:
  - Couples
  - Memory images
  - Puzzle images
  - Journey milestones
  - Dynamic love notes
  - Per-couple passcode + media limits
- Couple-private frontend data
- Per-couple lock/unlock flow
- Audit logging for sensitive actions

## Tech Stack

- Next.js 15
- React 19
- Prisma
- PostgreSQL
- Vercel Blob
- Auth.js (NextAuth)

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Fill all required values:
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`
   - `NEXTAUTH_URL`
   - `AUTH_SECRET`
   - `AUTH_RESEND_KEY`
   - `AUTH_RESEND_FROM`
   - `SUPER_ADMIN_EMAIL`
   - `PASSCODE_PEPPER`

For local development only, if `AUTH_RESEND_KEY` and `AUTH_RESEND_FROM` are missing, the app logs the magic link URL in the server terminal instead of sending email.

## Run Locally

```bash
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

## Admin Flow

1. Sign in using `SUPER_ADMIN_EMAIL`.
2. Go to `/backend/couples` and create a couple.
3. Invite couple members by email.
4. Members sign in through magic link.
5. Members unlock with that couple's passcode.
6. Members can view content only; admin manages all CRUD.

## Security Notes

- Rotate all leaked/old secrets before deploying.
- Keep `.env` out of git history.
- Use strong `AUTH_SECRET` and `PASSCODE_PEPPER`.
