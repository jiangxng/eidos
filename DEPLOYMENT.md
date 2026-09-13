# Packaging & Deployment

## Requirements
- Node.js 20+
- npm
- Docker is optional

## Verify source
```bash
npm ci
npm run release:check
```

`release:check` runs type checking, automated tests, repository validation, showcase syntax checks and the production-static build.

## Build production-static bundle
```bash
npm run build:release
```

Output: `release/`

Important entry points:
- `/showcase/` — commercial / multilingual product demo
- `/demo/` — engineering six-track demo
- `/capabilities.json` — machine-readable capability catalog
- `/contracts/` — versioned contracts
- `/llm/` — deterministic LLM context

## Local production preview
```bash
npm run serve:release
```
Default: `http://localhost:4173`

## Docker
```bash
npm run build:release
docker build -t eidos-showcase:rc .
docker run --rm -p 8080:80 eidos-showcase:rc
```

Then open `http://localhost:8080`.

## Static hosting
The `release/` directory is static and can be deployed to:
- GitHub Pages — example workflow: `deploy/github-pages.yml`
- Vercel — publish `release/`
- Netlify — `deploy/netlify.toml`
- S3 + CDN / OSS + CDN
- any Nginx/Apache/static object host

## Production integration with a real LLM / EC
Do not put model credentials in the browser demo.

Recommended topology:
```text
Browser / Eidos Studio
  -> your server-side EC/LLM adapter
  -> Experience Proposal
  -> Eidos deterministic validation
  -> Eidos realization
  -> ActionRequest
  -> authorized Host API
```

The model may change. The Eidos proposal/validation boundary should not.

## Cache policy
HTML should be short-cache/no-cache during active release cycles.
Versioned JS/CSS/contracts/catalog artifacts may use immutable fingerprints in a later bundler pipeline.

## Security
- never expose Host credentials in generated Experience contracts;
- never execute arbitrary LLM-generated JavaScript in Core Runtime;
- validate all proposals before realization;
- Host re-authorizes every real business action;
- treat customization as presentation state, not business truth.
