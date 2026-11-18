# Privacy

**Your evidence remains in your browser. GHOSTTRACE does not upload documents to external services.**

- There is no backend, database, authentication provider, telemetry, analytics, or third-party inference API.
- Imported TXT/CSV/JSON/Markdown files are read with the browser File API and parsed entirely on-device.
- Uploaded file contents are treated as untrusted text, rendered only as text, and kept in memory. They are deliberately excluded from `localStorage` persistence.
- Only harmless UI preferences and workspace state (scenario data, metadata, local entities/relationships/events, canvas) are persisted locally.
- Workspace export creates a JSON file on your device; import validates its schema before applying it.
- No secrets or API keys are used or stored.
- All built-in scenarios are fictional and contain no real personal information.

Browser storage can be cleared at any time from **Settings → Reset**, or through your browser's site-data controls. If storage is unavailable, the application continues in memory-only mode.
