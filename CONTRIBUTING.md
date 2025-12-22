# Contributing

This project welcomes contributions and suggestions. Please submit an issue or pull request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and add tests if applicable
4. Run tests: `npm test`
5. Commit your changes using [Conventional Commits](#commit-message-format)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

**Format:** `<type>(<scope>): <description>`

**Types:**

- `feat:` - A new feature (triggers **minor** version bump, e.g., 1.0.0 → 1.1.0)
- `fix:` - A bug fix (triggers **patch** version bump, e.g., 1.0.0 → 1.0.1)
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates

**Breaking Changes:**

- Add `BREAKING CHANGE:` in the commit footer or `!` after type to trigger **major** version bump (e.g., 1.0.0 → 2.0.0)

**Examples:**

```bash
feat(library): add filter by genre
fix(import): resolve duplicate detection issue
docs: update deployment instructions
feat!: redesign navigation structure
```

### Release Process

Releases are automated via semantic-release:

- Merging to `main` triggers tests, semantic versioning, and Docker image publishing
- Version numbers and changelogs are generated automatically from commit messages
- GitHub releases are created with release notes
