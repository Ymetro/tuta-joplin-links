# 📓 Joplin x-callback-url Button for Tuta

A lightweight Tampermonkey userscript that adds floating **"Open in Joplin"** buttons
next to `joplin://` links in [Tuta Calendar](https://app.tuta.com) — so you can jump
directly from a calendar event into the right note in Joplin.

---

## ⚡ Installation

[![Install with Tampermonkey](https://img.shields.io/badge/Install-Tampermonkey-brightgreen?logo=tampermonkey)](https://github.com/Ymetro/tuta-joplin-links/raw/main/joplin-tuta.user.js)

1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension in your browser
2. Click the badge above — or 👉 [Install Script](https://github.com/Ymetro/tuta-joplin-links/raw/main/joplin-tuta.user.js)
3. Open [app.tuta.com](https://app.tuta.com) — the script activates automatically

---

## ✨ Features

- 🔵 Floating button appears **right next to** any `joplin://` link in Tuta
- 🖱️ One click opens the linked note directly in Joplin
- ⚡ Works with Tuta's **single-page app** (SPA) — reacts to navigation and DOM changes
- 🔁 Buttons **reposition automatically** on window resize
- 🪶 Zero dependencies — pure vanilla JavaScript

---

## 📋 Requirements

- [Tampermonkey](https://www.tampermonkey.net/) browser extension
- [Joplin](https://joplinapp.org/) desktop app (with Web Clipper or local server running)
- A [Tuta](https://tuta.com/) account

---

## 💡 How it works

Tuta renders `joplin://` URLs as plain text (not clickable links).
This script scans the DOM for those text nodes and places a floating button
directly to the right of each one. Clicking the button triggers the
`joplin://` protocol handler, which opens the linked note in your local Joplin app.

---

## 🖼️ Screenshot

*(Coming soon)*

---

## 📄 License

[MIT License](LICENSE) — free to use, modify and share.
Credit appreciated but not required.

---

## 🙏 Acknowledgements

Built for personal use and shared with the community.
Feedback and contributions are welcome via [Issues](../../issues).
