# Contributing

## Commit Standards

This project follows **Conventional Commits** for all commit messages.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Usage                                        |
|------------|----------------------------------------------|
| `feat`     | New feature                                  |
| `fix`      | Bug fix                                      |
| `docs`     | Documentation only                           |
| `style`    | Formatting, missing semicolons, etc.         |
| `refactor` | Code change that neither fixes nor adds      |
| `perf`     | Performance improvement                      |
| `test`     | Adding or correcting tests                   |
| `build`    | Build system or external deps                |
| `ci`       | CI configuration                             |
| `chore`    | Maintenance, tooling, config                 |
| `revert`   | Revert a previous commit                     |

### Scope (optional)

Short noun for the affected module — e.g. `ui`, `docs`, `auth`, `api`, `db`.

### Examples

```
feat(docs): add category index page
fix(ui): correct button alignment on mobile
docs: update README with setup instructions
refactor(api): extract validation middleware
```

### Rules

1. **Imperative present tense** — "add" not "added" or "adds"
2. **No period** at end of description line
3. **Description** lowercase after type/scope
4. **Body** explains *what* and *why*, not *how*
5. Breaking changes: append `!` after type/scope and add `BREAKING CHANGE:` footer

### Why

- Auto-generated changelogs
- Semantic versioning inference
- Readable git history
- Easy filtering (`git log --grep="^feat"`)
