---
name: error-analysis
description: Analyze WeChat Mini Program / CloudBase error logs, identify root causes, and suggest concrete fixes.
---

# Error Log Analysis

You are analyzing errors from the DiaoAIVideo WeChat Mini Program project. The app uses CloudBase (云开发) for storage (`wx.cloud.uploadFile` / `getTempFileURL`) and database (`db.collection('photos')`).

## Workflow

When the user provides an error, follow this process:

### Step 1: Parse the error
Extract these key fields from the log:
- **errCode** — CloudBase errors start with `-6`; WeChat API errors have numeric codes
- **errMsg** — the human-readable message
- **Call site** — which API was called when it failed
- **Stack trace** — if any JS error, locate the file and line

### Step 2: Classify
Match against the known error table below. If no direct match, reason from the errMsg text.

### Step 3: Trace in codebase
Read the file(s) involved in the call chain. Identify:
- Whether the error is code-level (bad params, race condition) or environment-level (permissions, config)
- Whether the fix should be in JS code, cloud console settings, or DevTools config

### Step 4: Report
Output a structured report with:
1. **Error summary** — one line
2. **Root cause** — why it happened
3. **Fix** — concrete steps with code snippets if applicable
4. **Prevention** — how to avoid similar issues

## Known WeChat / CloudBase Error Codes

| Code | Message pattern | Typical cause | Fix direction |
|------|----------------|---------------|---------------|
| `-601034` | 没有权限，请先开通云开发或者云托管 | Project not linked to cloud env in DevTools, or `cloud` config missing in project.config.json | Click 云开发 button in DevTools toolbar → select env; ensure `project.config.json` has `"cloud": { "envId": "..." }` |
| `-1` | permission denied / 没有权限 | Cloud DB or storage permission too restrictive | Check collection/storage permission rules in cloud console |
| `-502001` | 数据库集合不存在 | Collection not created | Create collection in cloud console |
| `-502005` | 数据库请求失败 | Permission rule mismatch or network | Verify collection permissions |
| `-604101` | 文件不存在 | fileID not found in cloud storage | Check if file was deleted or fileID is correct |
| `uploadFile:fail` | — | File too large, network timeout, or storage not enabled | Verify storage is enabled, check file size < 10MB |
| `chooseMedia:fail cancel` | — | User cancelled the picker | Not an error — ignore silently (already handled) |
| `navigateTo:fail` | page not found | Page not registered in app.json | Add page to `app.json` pages array |
| `wx is not defined` | — | ES6 transpile issue or wrong lib version | Check `libVersion` in project.config.json |
| `cloud.init` fail | — | Invalid env ID or network issue | Verify env ID in app.js matches cloud console |

## Project-specific knowledge

When analyzing errors, know the codebase layout:
- `app.js` — `wx.cloud.init` with env `diao-ai-video-d3gtf3dpx9aee0594`
- `pages/upload/upload.js` — `chooseImage()`: `wx.chooseMedia` → `doUpload()`: `wx.cloud.uploadFile` + `db.collection('photos').add`
- `pages/index/index.js` — `loadPhotos()`: `db.collection('photos').orderBy('createdAt', 'desc').get()` → `wx.cloud.getTempFileURL`
- `project.config.json` — appid `wxfe3dc7e1c396f0b5`, cloud env declared

Cloud console permissions expected:
- DB `photos` collection: 仅创建者可读写
- Cloud storage: 仅创建者及管理员可读写

## Output format

Always structure your analysis like this:

```
## 错误分析

**错误摘要**：[一句话]

**根因**：[为什么]

**修复方法**：
1. [步骤一]
2. [步骤二]

**代码改动**（如需要）：
[具体代码]

**预防**：[一句话建议]
```
