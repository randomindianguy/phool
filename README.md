# Phool

An illustrated private cottage room for a birthday experience.

The central frame opens one local birthday video. Seven smaller frames show
seven local photos. Each photo can have its own Spotify track. A passcode gate
remembers an approved browser using `localStorage`.

## Media files

Add these files to `assets/`:

- `main.mp4`
- `2.png`
- `3.png`
- `4.png`
- `5.png`
- `6.png`
- `7.png`
- `8.png`

Paste the seven full Spotify track links into `songs.js`, beside the matching
photo filename. Spotify embeds normally require the visitor to press play
because browsers block cross-site autoplay.

Use `null` when a photo intentionally has no song. `8.png` currently uses this
setting and opens without the Spotify panel.

The current passcode is `phoolsbday`. Because this is a static site, the gate is
for privacy-by-obscurity rather than strong authentication; the passcode is
present in the browser source.
