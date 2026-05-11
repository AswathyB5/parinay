# Parinay Weddings — site + admin

React (Vite) frontend with serverless API routes for Vercel. Local development can still run the Express server in `server.js` alongside Vite.

---

## Deployment (Vercel) — handoff for hosting

### What gets deployed

- **Frontend:** Vite build output (`dist/`).
- **API:** Serverless functions under `api/` (not the long-running `server.js`).

`vercel.json` rewrites non-API routes to `index.html` for the SPA; `/api/*` is handled by the functions in `api/`.

### Build settings

| Setting        | Value        |
|----------------|--------------|
| Install        | `npm install` |
| Build          | `npm run build` |
| Output         | `dist` (Vite default) |

### Required environment variables

| Variable        | Required | Purpose |
|-----------------|----------|---------|
| `MONGODB_URI`   | **Yes**  | MongoDB connection string (alias `MONGO_URI` is also read by `api/_lib/db.js`). |
| `BLOB_READ_WRITE_TOKEN` | **Yes** (for admin media upload/delete) | Vercel Blob token used by `/api/upload` and `/api/upload/:filename`. |
| `ADMIN_USERNAME` | **Yes** | Username for `/admin` login. |
| `ADMIN_PASSWORD` | **Yes** | Password for `/admin` login. |
| `ADMIN_SESSION_SECRET` | **Yes** | Secret used to sign the admin session cookie. |
| `ADMIN_SESSION_TTL_SECONDS` | No | Session lifetime (default: `7200` seconds / 2 hours). |
| `SMTP_HOST` | Optional (required for inquiry emails) | SMTP server host (e.g. smtp.gmail.com). |
| `SMTP_PORT` | Optional (required for inquiry emails) | SMTP port (587 for TLS, 465 for SSL). |
| `SMTP_USER` | Optional (required for inquiry emails) | SMTP username/login. |
| `SMTP_PASS` | Optional (required for inquiry emails) | SMTP password/app password. |
| `SMTP_FROM` | Optional | Sender address shown in inquiry emails (falls back to `SMTP_USER`). |
| `INQUIRY_NOTIFICATION_EMAIL` | Optional | Inbox for inquiry alerts (defaults to `info.parinayweddings@gmail.com`). |

Set these in the Vercel project: **Settings → Environment Variables**.

### API routes (implemented)

| Method | Path | Purpose |
|--------|------|---------|
| `GET`  | `/api/health` | Health + DB connectivity |
| `GET`  | `/api/content` | Load latest saved site content from MongoDB |
| `POST` | `/api/content` | Save site content to MongoDB |
| `GET`  | `/api/admin/me` | Check whether the admin is authenticated |
| `POST` | `/api/admin/login` | Sign in and set admin session cookie |
| `POST` | `/api/admin/logout` | Clear admin session cookie |
| `GET`  | `/api/inquiries` | List inquiries (admin) |
| `POST` | `/api/inquiries` | Create inquiry / tracking |
| `PUT`  | `/api/inquiries/:id` | Update inquiry status |
| `DELETE` | `/api/inquiries/:id` | Delete inquiry |

`POST /api/inquiries` also sends an email notification when SMTP variables are configured.

### Media uploads (Vercel Blob)

`POST /api/upload` and `DELETE /api/upload/:filename` are now wired for Vercel Blob storage. Uploaded files return a public Blob URL (not `/uploads/...` local paths).

Important notes:

1. Vercel does **not** provide local persistent uploads by default in serverless functions.
2. Blob works only when `BLOB_READ_WRITE_TOKEN` is set in Vercel env vars.
3. Existing legacy `/uploads/...` URLs in old content still point to local/static files and should be re-uploaded or replaced with public URLs.

### Optional frontend env

If the API is on a **different origin** than the site, set:

- `VITE_API_URL` — base URL of the API (no trailing slash), e.g. `https://api.example.com`.

If frontend and API share the same Vercel deployment, leave it unset; the app uses same-origin `/api/...`.

---

## Local development

```bash
npm install
npm run dev
```

This runs Vite and `server.js` together (see `package.json`). For API parity with production, you can also test against Vercel’s dev environment once deployed.

---

## Project scripts

| Script   | Command |
|----------|---------|
| Dev      | `npm run dev` |
| Build    | `npm run build` |
| Preview  | `npm run preview` |
| Lint     | `npm run lint` |
