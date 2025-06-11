# ✨ Copy > AI Prompt > Report Public

Right-click to copy page content into customizable AI prompt templates using context menus and settings.

This extension lets you **quickly format and copy content from any webpage** using templates you define. Whether you're writing an AI prompt, summarizing an article, or turning a webpage into an X post, it's a **flexible tool to streamline your workflow**.

---

## 🖱️ How It Works

When you right-click:
- **On a link** → it grabs the link URL
- **On selected text** → it copies only the selection
- **On a page without selection** → it captures the entire visible page text (`innerText`)

Templates use `${content}` as a placeholder, which gets replaced automatically with the captured content.

---

## 🧩 Key Features

- ✅ Right-click menu on any website
- ✍️ Create and manage your own templates
- 🧠 Supports full page text, selected text, or links
- 💬 Custom formatting with `${content}` placeholder
- ⚙️ Built-in settings panel for managing templates

---

## 💡 Use Cases

- AI prompt creators (ChatGPT, Claude, etc.)
- Writers, bloggers, and researchers
- Developers and power users
- Anyone who regularly formats copied content

---

## 📁 Project Structure

```pgsql
📦 extension/
├── background.js         # Handles context menus and copy logic
├── content.js            # Extracts selected or full page content
├── popup.html/.js        # Popup interface for opening settings
├── options.html/.js      # Full UI to create/edit templates
├── manifest.json         # Extension configuration
└── logo.png              # Extension icon
```
---

## 📦 Installation

### 🔧 Firefox

1. Open `about:debugging` in Firefox
2. Click **“This Firefox” → “Load Temporary Add-on…”**
3. Select the `manifest.json` file from this repository
4. Done!

> ⚠️ To avoid `storage.sync` warnings, make sure your `manifest.json` includes:

```json
"browser_specific_settings": {
  "gecko": {
    "id": "copy-ai-prompt@example.com",
    "strict_min_version": "60.0"
  }
}
