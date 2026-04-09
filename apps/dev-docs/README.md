# Manyumba Dev Docs

Developer documentation for Manyumba, built with [VitePress](https://vitepress.dev).

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Structure

```
apps/dev-docs/
├── docs/                    # Documentation source files
│   ├── .vitepress/         # VitePress configuration
│   │   ├── config.ts       # Site configuration
│   │   └── theme/          # Custom theme (optional)
│   ├── index.md            # Home page
│   └── guide/              # Guide section
│       ├── introduction.md
│       └── getting-started.md
├── package.json
└── README.md
```

## Adding New Pages

1. Create a new `.md` file in the `docs/` directory
2. Add the page to the sidebar configuration in `docs/.vitepress/config.ts`
3. Link to it from existing pages

Example:
```markdown
# My New Page

Content goes here...
```

## Configuration

Edit `docs/.vitepress/config.ts` to customize:
- Site title and description
- Navigation menu
- Sidebar structure
- Theme options

For more details, see the [VitePress documentation](https://vitepress.dev).
