# FAST Athletics App

Bryant, AR youth track club. Train FAST. Run Confident. Compete Together.

## Overview

This is the official web app for FAST Athletics — a competitive youth track club for ages 5-18 based in Bryant, AR.

The app is a Progressive Web App (PWA) built with plain HTML, CSS, and JavaScript, deployed on Cloudflare Pages.

## Features

- Meet schedule and event info
- Coaching staff directory
- Club news and media
- Admin panel for content updates
- Offline support via service worker

## Deployment

Hosted on Cloudflare Pages at [fast-athletics-app.pages.dev](https://fast-athletics-app.pages.dev)

- `_headers` — Cloudflare cache-control rules
- `_redirects` — Cloudflare routing rules
- `sw.js` — Service worker for offline caching
- `manifest.json` — PWA manifest
- `data.json` — Content managed via admin panel
