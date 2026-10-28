const AUTH_KEY = "phool-auth-v1";
const PASSCODE = "phoolsbday";

const experience = document.querySelector(".experience");
const gate = document.querySelector("#passcode-gate");
const passcodeForm = document.querySelector("#passcode-form");
const passcodeInput = document.querySelector("#passcode-input");
const passcodeError = document.querySelector("#passcode-error");
const doorButton = document.querySelector(".door-hit");
const invitation = document.querySelector("#invitation-copy");
const photoOverlay = document.querySelector(".photo-overlay");
const photoViewer = document.querySelector(".photo-viewer");
const photoDisplay = document.querySelector("#photo-display");
const photoNumber = document.querySelector("#photo-number");
const photoCaption = document.querySelector("#photo-caption");
const photoPlaceholder = document.querySelector("#photo-placeholder small code");
const photoExperience = document.querySelector(".photo-experience");
const spotifyPlayer = document.querySelector("#spotify-player");
const songCard = document.querySelector(".song-card");
const songNumber = document.querySelector("#song-number");
const videoOverlay = document.querySelector(".video-overlay");
const videoShell = document.querySelector(".video-player-shell");
const mainVideo = document.querySelector("#main-video");
let stage = "door";

function unlock() {
  localStorage.setItem(AUTH_KEY, "yes");
  document.body.dataset.authenticated = "true";
  experience.setAttribute("aria-hidden", "false");
  gate.setAttribute("aria-hidden", "true");
}

if (localStorage.getItem(AUTH_KEY) === "yes") unlock();
else window.setTimeout(() => passcodeInput.focus(), 150);

passcodeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (passcodeInput.value === PASSCODE) {
    passcodeError.textContent = "";
    unlock();
    return;
  }
  passcodeError.textContent = "That isn’t the right knock. Try again.";
  passcodeInput.select();
});

function setStage(nextStage) {
  stage = nextStage;
  experience.dataset.stage = nextStage;
  photoOverlay.setAttribute("aria-hidden", String(nextStage !== "photo"));
  videoOverlay.setAttribute("aria-hidden", String(nextStage !== "video"));
  if (nextStage === "door") invitation.textContent = "Open the door";
  if (nextStage === "room") invitation.textContent = "Follow the thread. Choose a memory.";
  if (nextStage !== "video") mainVideo.pause();
}

function photoPath(index) {
  return `./assets/${index + 1}.png`;
}

function spotifyEmbedUrl(url) {
  if (!url) return "";
  const match = url.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
  return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}?theme=0` : "";
}

function setSong(index) {
  const filename = `${index + 1}.png`;
  const trackUrl = window.PHOOL_SONGS?.[filename];
  const hasNoSong = trackUrl === null;
  const embedUrl = spotifyEmbedUrl(trackUrl || "");
  songNumber.textContent = String(index);
  songCard.hidden = hasNoSong;
  photoExperience.classList.toggle("has-no-song", hasNoSong);
  songCard.classList.toggle("has-song", Boolean(embedUrl));
  if (embedUrl) spotifyPlayer.src = embedUrl;
  else spotifyPlayer.removeAttribute("src");
}

function wirePhoto(button) {
  const index = Number(button.dataset.photo);
  const path = photoPath(index);
  const thumbnail = new Image();
  thumbnail.onload = () => {
    button.classList.add("has-photo");
    button.style.backgroundImage = `url("${path}")`;
  };
  thumbnail.src = path;

  button.addEventListener("click", () => {
    if (stage !== "room") return;
    photoNumber.textContent = String(index);
    photoCaption.textContent = `Photo ${index} of 7`;
    photoPlaceholder.textContent = `assets/${index + 1}.png`;
    photoViewer.classList.remove("has-photo");
    photoDisplay.removeAttribute("src");
    photoDisplay.alt = `Memory photo ${index}`;
    const fullPhoto = new Image();
    fullPhoto.onload = () => {
      photoDisplay.src = path;
      photoViewer.classList.add("has-photo");
    };
    fullPhoto.src = path;
    setSong(index);
    setStage("photo");
  });
}

document.querySelectorAll("[data-photo]").forEach(wirePhoto);
mainVideo.addEventListener("loadedmetadata", () => videoShell.classList.add("has-video"));
mainVideo.addEventListener("error", () => videoShell.classList.remove("has-video"));

doorButton.addEventListener("click", () => {
  if (stage !== "door") return;
  setStage("opening");
  invitation.textContent = "";
  window.setTimeout(() => setStage("crossing"), 900);
  window.setTimeout(() => setStage("room"), 2100);
});

document.querySelector('[data-video="main"]').addEventListener("click", () => {
  if (stage === "room") setStage("video");
});

document.querySelectorAll("[data-close-overlay]").forEach((button) => {
  button.addEventListener("click", () => {
    spotifyPlayer.removeAttribute("src");
    setStage("room");
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && (stage === "photo" || stage === "video")) {
    spotifyPlayer.removeAttribute("src");
    setStage("room");
  }
});

setStage("door");
