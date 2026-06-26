# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DiaoAIVideo is a WeChat Mini Program for photo upload and display, using **CloudBase (云开发)** for cloud storage and database. Built with the native WeChat Mini Program framework (not uni-app/Taro).

## Architecture

- **Runtime**: WeChat Mini Program native framework, developed with WeChat DevTools
- **Cloud**: CloudBase — `wx.cloud.init` in `app.js`, cloud storage for images, cloud database (`photos` collection) for metadata
- **Pages**: Two pages — `pages/index/index` (photo wall) and `pages/upload/upload` (upload)

Data flow: Upload → `wx.cloud.uploadFile` → cloud storage returns `fileID` → `db.collection('photos').add` stores record → Index page queries `photos` descending by `createdAt` → `wx.cloud.getTempFileURL` resolves `cloud://` links → grid display + `wx.previewImage` on tap.

## Key Files

- `app.js` — CloudBase init with `env` placeholder
- `app.json` — Page registration, window config
- `project.config.json` — WeChat project config with `appid` placeholder
- `pages/index/index.js` — Photo wall: cloud DB query, temp URL conversion, preview
- `pages/upload/upload.js` — Photo upload: choose media → cloud upload → DB insert

## Placeholders to Replace

| File | Placeholder | Meaning |
|------|-------------|---------|
| `app.js` | `YOUR_ENV_ID` | CloudBase environment ID |
| `project.config.json` | `YOUR_APPID` | WeChat Mini Program AppID |
