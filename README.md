# Phool

An illustrated private cottage room for a birthday experience.

The central frame displays `8.jpg` and opens one local birthday video. Six
smaller frames show the named photo files below, each paired with a Spotify track.
A passcode gate remembers an approved browser using `localStorage`.

## Media files

Add these files to `assets/`:

- `main.mp4`
- `2.jpeg`
- `3.jpeg`
- `4.heif`
- `5.jpeg`
- `6.jpeg`
- `7.JPG`
- `8.jpg`

Paste the six full Spotify track links into `songs.js`, beside the matching
photo filename. Spotify embeds normally require the visitor to press play
because browsers block cross-site autoplay.

Convert `4.heif` to `4.jpg` before the final publish if the site needs to work
outside Safari. HEIF support remains inconsistent across browsers.

The current passcode is `phoolsbday`. Because this is a static site, the gate is
for privacy-by-obscurity rather than strong authentication; the passcode is
present in the browser source.
