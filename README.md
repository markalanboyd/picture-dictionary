# Picture Dictionary

A tiny Firefox extension that shows you **what a word means with pictures instead of a definition**. Highlight a word on any web page, and a small popup appears with image-search results. Click anywhere else and it disappears.

This is a proof-of-concept demo. The long-term idea is a visual dictionary for e-ink readers (such as Boox tablets), where you highlight a word in a book and see what it looks like.

## Features

- Highlight a word or short phrase and see pictures right away
- Pictures only: no definitions, no buttons, no clutter
- Number of pictures is adjustable (1–12)
- Closes when you click elsewhere or press `Esc`
- Two image sources: DuckDuckGo (with automatic fallback) or Openverse

## Install (temporary, for testing)

1. Download or clone this repository.
2. In Firefox, type `about:debugging` into the address bar and press Enter.
3. Click **This Firefox** in the left sidebar.
4. Under **Temporary Extensions**, click **Load Temporary Add-on…**
5. Select the `manifest.json` file from this folder.

Temporary add-ons are removed when Firefox restarts, so repeat these steps next time.

## Usage

1. Open any web page.
2. Highlight a word.
3. Pictures appear just below your selection.
4. Click elsewhere (or press `Esc`) to dismiss.

## Settings

Open `about:addons`, find **Picture Dictionary**, and choose **Preferences**.

| Setting | Default | Description |
| --- | --- | --- |
| Number of pictures | 6 | How many images to show (1–12) |
| Max words | 2 | Selections longer than this are ignored, so highlighting a sentence won't trigger a lookup |
| Image source | DuckDuckGo | DuckDuckGo (falls back to Openverse if it fails) or Openverse only |

## How it works

| File | Role |
| --- | --- |
| `manifest.json` | Extension configuration and permissions |
| `content.js` | Detects text selection and draws the popup |
| `background.js` | Fetches image results from DuckDuckGo or Openverse |
| `options.html` / `options.js` | Settings page |

## Known limitations

- **DuckDuckGo has no official image API.** This extension uses an unofficial method that can break without warning. If you see "No pictures found", switch the source to **Openverse only** in Preferences.
- **Openverse** is stable, but its results are mostly free-licensed photos and work better for concrete nouns than abstract words.
- Some websites (GitHub, for example) block images from other domains, so the popup may appear empty there.
- PDFs opened in Firefox's built-in viewer may not trigger the popup.
- Manifest V2 only, for simplicity.

## Privacy

Every word you highlight (up to the max-words limit) is sent to DuckDuckGo or Openverse to fetch images. Nothing is stored or sent anywhere else, and settings are saved locally in your browser. If that matters to you, don't use the extension on pages with sensitive text.

## Roadmap

- [ ] Android version for Boox e-ink tablets (text-selection menu integration)
- [ ] E-ink-friendly styling (grayscale, no animation)
- [ ] Tap an image to enlarge it
- [ ] Optional official image APIs (e.g. Brave Search)
- [ ] Cache results to avoid repeat lookups

## License

Choose a license before publishing (MIT is a common, permissive choice).
