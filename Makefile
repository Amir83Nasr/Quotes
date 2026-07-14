# ── Quotes Makefile ─────────────────────────────────────────────────────────
SHELL := /bin/bash
.ONESHELL:

# ── ANSI colors ───────────────────────────────────────────────────────────────
ESC    := $(shell printf '\033')
BOLD   := $(ESC)[1m
RESET  := $(ESC)[0m
GREEN  := $(ESC)[32m
CYAN   := $(ESC)[36m
YELLOW := $(ESC)[33m
RED    := $(ESC)[31m
GREY   := $(ESC)[90m

# ── Project config ────────────────────────────────────────────────────────────
PROJECT_NAME    := Quotes
COMPOSE_FILE    ?= compose.yml
COMPOSE_PROJECT := quotes
NEXT_PORT       ?= 4000

# ── Project variables ─────────────────────────────────────────────────────────
CUR_VERSION := $(shell grep -m1 '"version"' package.json | sed -E 's/.*"([0-9]+\.[0-9]+\.[0-9]+)".*/\1/')

.DEFAULT_GOAL := help

.PHONY: install dev build \
        lint format format-check typecheck check \
        test \
        up down logs ps rebuild \
        version version-sync version-bump version-tag \
        env env-show \
        hooks-install hooks-run hooks-pre-commit \
        clean doctor help

# ── Install ───────────────────────────────────────────────────────────────────
install: ## Install dependencies
	@pnpm install
	@echo "  $(GREEN)✓$(RESET) Dependencies installed"

# ── Development ───────────────────────────────────────────────────────────────
dev: ## Dev server :$(NEXT_PORT)
	@pnpm dev

build: ## Build for production
	@pnpm build
	@echo "  $(GREEN)✓$(RESET) Build complete"

# ── Lint ──────────────────────────────────────────────────────────────────────
lint: ## ESLint
	@pnpm lint
	@echo "  $(GREEN)✓$(RESET) Lint passed"

format: ## Format with Prettier
	@pnpm format
	@echo "  $(GREEN)✓$(RESET) Formatting complete"

format-check: ## Check formatting (CI)
	@pnpm prettier --check "**/*.{ts,tsx,js,mjs,cjs,jsx,json,css,md,mdx}"
	@echo "  $(GREEN)✓$(RESET) Format check passed"

typecheck: ## Type-check (tsc --noEmit)
	@pnpm typecheck
	@echo "  $(GREEN)✓$(RESET) Type check passed"

check: lint typecheck ## Run quality checks (lint + typecheck)

# ── Test ──────────────────────────────────────────────────────────────────────
test: ## Run tests (placeholder)
	@echo "  $(GREY)No test suite configured — skipping$(RESET)"

# ── Docker ────────────────────────────────────────────────────────────────────
up: ## Start Docker services
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) up -d --wait
	@echo "  $(GREEN)✓$(RESET) Docker services started"

down: ## Stop Docker services
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) down
	@echo "  $(GREEN)✓$(RESET) Docker services stopped"

logs: ## Tail Docker logs
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) logs -f

ps: ## Show Docker status
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) ps

rebuild: ## Rebuild Docker from scratch
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) up -d --build --wait
	@echo "  $(GREEN)✓$(RESET) Docker services rebuilt and started"

# ── Version Management ────────────────────────────────────────────────────────
version: ## Show current version
	@echo "  $(CUR_VERSION)"

version-sync: ## Sync version (V="x.y.z")
	$(eval V := $(if $(V),$(V),$(CUR_VERSION)))
	@sed -i '' -E 's/"version": ".*"/"version": "$(V)"/' package.json
	@echo "  $(GREEN)✓$(RESET) Version synced to $(V)"

version-bump: ## Bump version (BUMP=patch|minor|major)
	@if [ -z "$(BUMP)" ]; then \
		echo "  $(RED)✗$(RESET) Usage: make version-bump BUMP=patch|minor|major"; \
		exit 1; \
	fi
	$(eval MAJ := $(word 1,$(subst ., ,$(CUR_VERSION))))
	$(eval MIN := $(word 2,$(subst ., ,$(CUR_VERSION))))
	$(eval PAT := $(word 3,$(subst ., ,$(CUR_VERSION))))
	@case "$(BUMP)" in \
		patch) NEW_V="$(MAJ).$(MIN).$$(expr $(PAT) + 1)";; \
		minor) NEW_V="$(MAJ).$$(expr $(MIN) + 1).0";; \
		major) NEW_V="$$(expr $(MAJ) + 1).0.0";; \
		*) echo "  $(RED)✗$(RESET) Invalid BUMP: $(BUMP). Use patch, minor, or major."; exit 1;; \
	esac; \
	$(MAKE) version-sync V=$$NEW_V; \
	echo "  $(GREEN)✓$(RESET) Bumped $(CUR_VERSION) → $$NEW_V"

version-tag: ## Tag version & push
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "  $(YELLOW)⚠$(RESET) Uncommitted changes — commit or stash before tagging"; \
		exit 1; \
	fi
	@git tag -a "v$(CUR_VERSION)" -m "Release v$(CUR_VERSION)"
	@git push origin "v$(CUR_VERSION)"
	@echo "  $(GREEN)✓$(RESET) Tagged v$(CUR_VERSION) and pushed"

# ── Environment ───────────────────────────────────────────────────────────────
env: ## Bootstrap .env.local
	@if [ ! -f .env.local ]; then \
		if [ -f .env.example ]; then \
			cp .env.example .env.local; \
			echo "  $(GREEN)✓$(RESET) Created .env.local from .env.example"; \
			echo "  $(YELLOW)⚠$(RESET) Edit .env.local with real values before starting"; \
		else \
			echo "  $(YELLOW)⚠$(RESET) No .env.example found — create one with your env vars"; \
		fi; \
	else \
		echo "  $(GREY).env.local already exists — no changes made$(RESET)"; \
	fi

env-show: ## Show unset placeholders
	@echo "  $(BOLD)Unset placeholders:$(RESET)"
	@grep -n 'change-me\|YOUR_\|MY_\|<.*>' .env.local .env.example 2>/dev/null || \
		echo "  $(GREY)(none found)$(RESET)"

# ── Git Hooks (Lefthook) ──────────────────────────────────────────────
hooks-install: ## Install git hooks
	@pnpm lefthook install
	@echo "  $(GREEN)✓$(RESET) Lefthook hooks installed"

hooks-run: ## Run hooks on staged files
	@pnpm lefthook run pre-commit

hooks-pre-commit: hooks-run ## Alias: pre-commit hooks

# ── Clean ─────────────────────────────────────────────────────────────────────
clean: ## Remove build artifacts
	@rm -rf .next out build coverage
	@find . -type d -name '.next' -exec rm -rf {} + 2>/dev/null || true
	@find . -type f \( -name '*.tsbuildinfo' -o -name '*.tsbuildinfo.*' \) -delete 2>/dev/null || true
	@echo "  $(GREEN)✓$(RESET) Build artifacts cleaned"

# ── Maintenance ───────────────────────────────────────────────────────────────
doctor: ## Check system
	@echo ""
	@printf "$(BOLD)System Check — $(PROJECT_NAME)$(RESET)\n"
	@printf -- "$(GREY)─────────────────────────$(RESET)\n"
	@for cmd in node pnpm docker; do \
		if command -v $$cmd &>/dev/null; then \
			printf "  $(GREEN)✓$(RESET) $$cmd found\n"; \
		else \
			printf "  $(YELLOW)⚠$(RESET) $$cmd not found\n"; \
		fi; \
	done
	@if docker compose version &>/dev/null 2>&1; then \
		printf "  $(GREEN)✓$(RESET) Docker Compose v2 available\n"; \
	else \
		printf "  $(YELLOW)⚠$(RESET) Docker Compose v2 not available\n"; \
	fi
	@if [ -f "$(COMPOSE_FILE)" ]; then \
		printf "  $(GREEN)✓$(RESET) $(COMPOSE_FILE) found\n"; \
	else \
		printf "  $(GREY)─$(RESET) No $(COMPOSE_FILE) — Docker services not configured\n"; \
	fi
	@if lsof -i :$(NEXT_PORT) &>/dev/null 2>&1; then \
		printf "  $(GREEN)✓$(RESET) Port $(NEXT_PORT) in use\n"; \
	else \
		printf "  $(YELLOW)⚠$(RESET) Port $(NEXT_PORT) free — run 'make dev'\n"; \
	fi
	@if [ -d "node_modules" ]; then \
		printf "  $(GREEN)✓$(RESET) Node deps installed\n"; \
	else \
		printf "  $(YELLOW)⚠$(RESET) Node deps missing — run 'make install'\n"; \
	fi
	@if ls lefthook.yml &>/dev/null 2>&1; then \
		printf "  $(GREEN)✓$(RESET) Lefthook configured\n"; \
	else \
		printf "  $(YELLOW)⚠$(RESET) No lefthook.yml\n"; \
	fi
	@printf -- "$(GREY)─────────────────────────$(RESET)\n"
	@printf "  $(BOLD)$(PROJECT_NAME)$(RESET) — Next.js on http://localhost:$(NEXT_PORT)\n"
	@echo ""

# ── Help ──────────────────────────────────────────────────────────────────────
help: ## Show help
	@printf "\n"
	@printf "\033[1;36m"
	@printf "   %s\n" " ██████╗ ██╗   ██╗ ██████╗ ████████╗███████╗███████╗"
	@printf "   %s\n" "██╔═══██╗██║   ██║██╔═══██╗╚══██╔══╝██╔════╝██╔════╝"
	@printf "   %s\n" "██║   ██║██║   ██║██║   ██║   ██║   █████╗  ███████╗"
	@printf "   %s\n" "██║▄▄ ██║██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║"
	@printf "   %s\n" "╚██████╔╝╚██████╔╝╚██████╔╝   ██║   ███████╗███████║"
	@printf "   %s\n" " ╚══▀▀═╝  ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝"
	@printf "\033[0m"
	@printf "\n"
	@awk 'BEGIN {FS = ":.*##"; section = ""; last = ""; line = "─────────────────────────────────────────────────────────────────────────────"} \
	/^# ── / { \
		s=$$0; gsub(/^# ──+ /,"",s); gsub(/ ──+.*$$/,"",s); section=s; \
	} \
	/^[a-zA-Z_-]+:.*##/ { \
		t=$$1; d=$$2; \
		if (section != last) { \
			if (last != "") printf "\033[2;37m└" line "┘\033[0m\n\n"; \
			printf "\033[2;37m┌─────────────────────────────────────────────────────────────────────────────┐\033[0m\n"; \
			printf "\033[2;37m│ \033[1;37m%-63s\033[0m \033[2;37m            │\033[0m\n", section; \
			printf "\033[2;37m├─────────────────────────────────────────────────────────────────────────────┤\033[0m\n"; \
			last = section; \
		} \
		printf "\033[2;37m│ \033[1;36m%-28s\033[0m \033[2;37m%-42s\033[0m \033[2;37m    │\033[0m\n", t, d; \
	} END {printf "\033[2;37m└" line "┘\033[0m\n\n";}' Makefile
	@printf "\033[2;37m───────────────────────────────────────────────────────────────────────────────\033[0m\n"
	@printf "\033[2;37m→\033[0m \033[1;37mmake\033[0m \033[1;36m<command>\033[0m\n"
	@printf "\n"
