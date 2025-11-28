# Jisho Export

---

A browser extension for Firefox and Chrome used to save definitions on [Jisho](https://jisho.org/) and export them for later review.

Made with React + TypeScript + Vite

## How to use Jisho Export

## Creating a Build

### Build Requirements

Operating Systems

- Windows 10 or later
- macOS 12 or later
- Any recent Linux distribution (Ubuntu 20.04+, Debian 11+, etc.)

Build Environment

- Node.js: v24.11.1 LTS (tested)
- npm: v11.6.4 (comes with Node 20)
- Disk space: ~200 MB free
- Memory: 4 GB RAM minimum (8 GB recommended)

External Tools / Build Stack

- Vite – dev server and build tool
- Rollup (via Vite) – production bundler
- esbuild (via Vite) – TS/JS transform & minification
- TypeScript – type checking / source language
- Tailwind CSS – CSS processing
- React – UI framework for popup/options

All of these are installed as npm dependencies and do not need to be installed globally.

### Installation & Build Instructions

1. Clone the repository

```
git clone https://github.com/emmanuelpinca/jisho-export.git
cd jisho-export
```

2. Install dependencies

```
npm install
```

This installs all Node-based build tools (Vite, TypeScript, Tailwind, etc.) listed in `package.json`.

3. Build the extension

```
npm run build
```

This runs the configured Vite build, which:

- Bundles the background script, content scripts, popup page, and options page
- Compiles TypeScript to JavaScript
- Processes Tailwind CSS
- Outputs a production build into the `dist/` directory

4. Resulting build artifacts

After `npm run build`, you should see:

```
dist/
  assets/...
  index.html
  manifest.json
  options.html
  ...
```

5. (Optional) Create the XPI/ZIP

From inside the `dist/` directory:

```
cd dist
# Zip all contents of dist/, not the dist folder itself
zip -r ../jisho-export.zip .
```

### Build Script Description

In `package.json`, the relevant script is:

```
{
  "scripts": {
    "build": "vite build"
  }
}
```

- `npm run build` calls vite build
- `vite build` uses the project’s `vite.config.ts` file to:
  - Configure entry points for popup, options, background, and content scripts
  - Configure Rollup output
  - Apply Tailwind processing

### Program Versions & Installation Instructions

**Node.js**

Required version: 24.11.1 LTS

Install from: [https://nodejs.org](https://nodejs.org)

**npm**

-Installed automatically with Node.js 24
-Confirm version:

```
node -v   # should be v24.11.1
npm -v    # should be v11.6.4
```

No global installation of Vite, TypeScript, Tailwind, etc. is required—the project uses local devDependencies.
