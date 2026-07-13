<p align="center">
  <img src="public/logo.svg" alt="Quotes logo" width="120" height="120">
</p>

# Quotes

Interactive learning platform for web development. Quotes takes you from fundamentals to production-ready skills across frontend, fullstack, git, and modern frameworks — with hands-on MDX lessons, live code editors, interactive challenges, and playground demos for React 19 features.

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
