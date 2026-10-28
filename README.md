# Phool

An illustrated private cottage room for a birthday experience.

The central frame displays `8.png` and opens one local birthday video. Six
smaller frames show `2.png` through `7.png`, each paired with a Spotify track.
A passcode gate remembers an approved browser using `localStorage`.

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

Paste the six full Spotify track links into `songs.js`, beside the matching
photo filename. Spotify embeds normally require the visitor to press play
because browsers block cross-site autoplay.

The current passcode is `phoolsbday`. Because this is a static site, the gate is
for privacy-by-obscurity rather than strong authentication; the passcode is
present in the browser source.
