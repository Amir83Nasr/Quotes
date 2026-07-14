<p align="center">
  <img src="public/logo.svg" alt="Quotes logo" width="120" height="120">
</p>

# Quotes

Interactive learning platform for web development. Quotes takes you from fundamentals to production-ready skills across frontend, fullstack, git, and modern frameworks — with hands-on MDX lessons, live code editors, interactive exercises, and playground demos for React 19 features.

Built with Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui. Over 120+ MDX lessons across 11 categories covering HTML/CSS, JavaScript, TypeScript, React, Next.js, Node.js, databases, testing, git, and more.

## Prerequisites

- **Node.js** 20+
- **pnpm** 9+

## Quick Start

```bash
# Install dependencies
make install

# Start dev server (http://localhost:4000)
make dev
```

## Development Workflow

### Available Commands

| Category    | Command                        | Description                            |
| ----------- | ------------------------------ | -------------------------------------- |
| Install     | `make install`                 | Install all dependencies               |
| Dev         | `make dev`                     | Start Next.js dev server (port 4000)   |
| Dev         | `make build`                   | Build for production                   |
| Quality     | `make lint`                    | ESLint                                 |
| Quality     | `make format`                  | Prettier                               |
| Quality     | `make typecheck`               | TypeScript type checking               |
| Quality     | `make check`                   | Lint + typecheck                       |
| Version     | `make version`                 | Show current version                   |
| Version     | `make version-bump BUMP=patch` | Bump version                           |
| Env         | `make env`                     | Create`.env.local` from `.env.example` |
| Hooks       | `make hooks-install`           | Install Lefthook git hooks             |
| Hooks       | `make hooks-run`               | Run hooks on staged files              |
| Maintenance | `make doctor`                  | Check system requirements              |
| Maintenance | `make clean`                   | Remove build artifacts                 |
| Help        | `make help`                    | List all commands                      |

Run `make help` for the full list with descriptions.

### Git Hooks (Lefthook)

The project uses [Lefthook](https://lefthook.dev) to enforce code quality automatically:

- **Trailing whitespace** — auto-removed
- **End-of-file newline** — ensures files end with newline
- **Merge conflict markers** — blocks unresolved markers
- **JSON / YAML / TOML** — validates syntax
- **Private key detection** — blocks accidental secret commits
- **Line endings** — enforces LF
- **Prettier** — auto-formats TS/JS/JSON/CSS/MD
- **ESLint** — lints and auto-fixes TS/JS

All hooks run in parallel on staged files. Formatters auto-re-stage their changes.

Install with:

```bash
make hooks-install
```

Run on all files:

```bash
make hooks-run       # all staged files
pnpm lefthook run pre-commit --all  # or: all tracked files
```

### Project Structure

```
app/           — Next.js App Router pages and layouts
components/    — React components (ui, layout, docs, lesson, playground)
constants/     — Site config, categories, sidebar navigation
content/       — MDX lesson content
hooks/         — Custom React hooks
lib/           — Utilities, content processing, navigation helpers
public/        — Static assets
scripts/       — Build and validation scripts
types/         — TypeScript type definitions
```

## Adding Components

```bash
npx shadcn@latest add button
```

## Deployment

This project is designed for deployment on **Vercel**, the native platform for Next.js.

### Vercel Setup

1. Push the repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects:
   - **Framework:** Next.js
   - **Build Command:** `next build` (default)
   - **Output Directory:** Automatic (Vercel optimized)
   - **Package Manager:** pnpm (auto-detected from lockfile)
   - **Node Version:** 22.x (set in Project Settings → General)

4. Click **Deploy** — the first deployment starts immediately.

### Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable               | Local Value             | Production Value          | Required |
| ---------------------- | ----------------------- | ------------------------- | -------- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:4000` | `https://your-domain.com` | Yes      |

Vercel injects system variables automatically (`VERCEL`, `VERCEL_ENV`, `VERCEL_URL`, `NEXT_PUBLIC_VERCEL_URL`) — no manual setup needed.

For local development, copy the example file:

```bash
cp .env.example .env.local
```

### GitHub Integration

Vercel connects directly to your GitHub repository:

```mermaid
git push
   ↓
GitHub
   ↓
Vercel detects commit
   ↓
Automatic build & deploy
```

- Every push to **main** deploys to **Production**.
- Every push to a **feature branch** creates a **Preview Deployment** with a unique URL.
- Preview deployments include comments with the URL directly on GitHub PRs.
- No GitHub Actions needed for deployment — Vercel's native integration handles it.

**Note:** The existing `.github/workflows/deploy.yml` is preserved for backward compatibility but is superseded by Vercel's native deployment pipeline.

### Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains.
2. Add your domain (e.g., `quotes.example.com`).
3. Update DNS records as instructed (CNAME for subdomain, A/ALIAS for apex).
4. Vercel provisions an SSL certificate automatically (Let's Encrypt).
5. Update `NEXT_PUBLIC_SITE_URL` environment variable to match the custom domain.

### Production Deployment Workflow

```
                                ┌─────────────────────┐
                                │   Developer pushes   │
                                │   to feature branch  │
                                └─────────┬───────────┘
                                          │
                                          ▼
                                ┌─────────────────────┐
                                │  Vercel Preview     │
                                │  Deployment         │
                                │  (unique URL)       │
                                └─────────┬───────────┘
                                          │
                     PR review & approval │
                                          │
                                          ▼
                                ┌─────────────────────┐
                                │  Merge to main      │
                                └─────────┬───────────┘
                                          │
                                          ▼
                                ┌─────────────────────┐
                                │  Vercel Production  │
                                │  Deployment         │
                                │  (production URL)   │
                                └─────────────────────┘
```

### Production Best Practices

- **Image Optimization:** Enabled by default on Vercel — no configuration needed.
- **Compression:** Vercel applies Brotli/gzip compression automatically.
- **Caching:** Optimal cache headers applied by Vercel Edge Network.
- **SSL/TLS:** Auto-provisioned certificates with automatic renewal.
- **DDoS Protection:** Included with Vercel's Edge Network.
- **Analytics:** Enable Vercel Analytics in Dashboard for real-time insights.
