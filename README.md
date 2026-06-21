# Cosmic Roulette

![Check](https://github.com/tlonny/cosmic/actions/workflows/check.yml/badge.svg)
![Release](https://github.com/tlonny/cosmic/actions/workflows/release.yml/badge.svg)

Swipeable astronomy flash cards for toddlers learning about space.

## Develop locally

Install dependencies with Bun, then run the development server:

```sh
bun install
bun run dev
```

This watches `src`, `asset`, and the build script for changes, rebuilds into `dist`, and serves the app at: `http://localhost:5050`.

## Build

To create a production build:

```sh
bun run build
```

The generated app is written to `dist`.

## Check

Run typechecking, linting, and a production build:

```sh
bun run check
```
