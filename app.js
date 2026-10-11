const variantNames = {
  A: "photo orbit",
  B: "panorama wall",
  C: "focus ring",
};

const params = new URLSearchParams(window.location.search);
const requestedVariant = (params.get("variant") || "A").toUpperCase();
const variant = variantNames[requestedVariant] ? requestedVariant : "A";

document.body.dataset.variant = variant;

const experience = document.querySelector(".experience");
const doorButton = document.querySelector(".door-hit");
const invitation = document.querySelector("#invitation-copy");
const stateCopy = document.querySelector("#state-copy");
const galleryOverlay = document.querySelector(".gallery-overlay");
const videoOverlay = document.querySelector(".video-overlay");
const videoTitle = document.querySelector("#video-title");
const orbitScene = document.querySelector("#orbit-scene");
const panoramaStrip = document.querySelector("#panorama-strip");
const lanternFocus = document.querySelector("#lantern-focus");
const lanternRing = document.querySelector("#lantern-ring");
const galleryCount = document.querySelector("#gallery-count");
const previousPhoto = document.querySelector("#gallery-previous");
const nextPhoto = document.querySelector("#gallery-next");
const variantLabel = document.querySelector("#variant-label");

let stage = "door";
let currentPhoto = 0;
let dragStartX = null;
let dragDelta = 0;
const photoCount = 8;

function photoCard(index) {
  const card = document.createElement("div");
  card.className = "photo-card";
  card.style.setProperty("--i", String(index));
  card.textContent = index === 0 ? "Main photo" : `Physical photo ${String(index + 1).padStart(2, "0")}`;
  return card;
}

for (let index = 0; index < photoCount; index += 1) {
  orbitScene.append(photoCard(index));

  const panoramaCard = photoCard(index);
  panoramaCard.dataset.photo = String(index);
  panoramaStrip.append(panoramaCard);

  const lanternButton = document.createElement("button");
  lanternButton.type = "button";
  lanternButton.dataset.photo = String(index);
  lanternButton.setAttribute("aria-label", `Show physical photo ${index + 1}`);
  lanternButton.append(photoCard(index));
  lanternRing.append(lanternButton);
}

lanternFocus.append(photoCard(0));

function setStage(nextStage) {
  stage = nextStage;
  experience.dataset.stage = nextStage;
  stateCopy.textContent = `${variant} · ${nextStage}`;

  galleryOverlay.setAttribute("aria-hidden", String(nextStage !== "gallery"));
  videoOverlay.setAttribute("aria-hidden", String(nextStage !== "video"));

  if (nextStage === "door") invitation.textContent = "Open the door";
  if (nextStage === "room") invitation.textContent = "Follow the thread. Choose a frame.";
}

function updateGallery() {
  const normalized = ((currentPhoto % photoCount) + photoCount) % photoCount;
  currentPhoto = normalized;

  orbitScene.style.transform = `rotateY(${-normalized * 45}deg)`;
  const orbitCards = [...orbitScene.children];
  orbitCards.forEach((card, index) => {
    const directDistance = Math.abs(index - normalized);
    const circularDistance = Math.min(directDistance, photoCount - directDistance);
    card.classList.toggle("is-current", circularDistance === 0);
    card.classList.toggle("is-nearby", circularDistance === 1);
  });

  const panoramaCards = [...panoramaStrip.children];
  panoramaCards.forEach((card, index) => card.classList.toggle("is-current", index === normalized));
  const activePanoramaCard = panoramaCards[normalized];
  const panoramaWindow = document.querySelector(".panorama-window");
  const stripOffset = panoramaWindow.clientWidth / 2 - activePanoramaCard.offsetLeft - activePanoramaCard.offsetWidth / 2;
  panoramaStrip.style.transform = `translateX(${stripOffset}px)`;

  lanternFocus.replaceChildren(photoCard(normalized));
  lanternRing.style.transform = `rotate(${-normalized * 5}deg)`;
  [...lanternRing.children].forEach((button, index) => {
    button.style.opacity = index === normalized ? "1" : ".58";
  });

  galleryCount.textContent = `${String(normalized + 1).padStart(2, "0")} / ${String(photoCount).padStart(2, "0")}`;
}

function moveGallery(direction) {
  currentPhoto += direction;
  updateGallery();
}

function switchVariant(direction) {
  const keys = Object.keys(variantNames);
  const index = keys.indexOf(variant);
  const nextVariant = keys[(index + direction + keys.length) % keys.length];
  window.location.assign(`?variant=${nextVariant}`);
}

const variantKeys = Object.keys(variantNames);
const variantIndex = variantKeys.indexOf(variant);
document.querySelector("#previous-variant").href = `?variant=${variantKeys[(variantIndex - 1 + variantKeys.length) % variantKeys.length]}`;
document.querySelector("#next-variant").href = `?variant=${variantKeys[(variantIndex + 1) % variantKeys.length]}`;
variantLabel.href = `?variant=${variant}`;
variantLabel.textContent = `${variant} · ${variantNames[variant]}`;

doorButton.addEventListener("click", () => {
  if (stage !== "door") return;
  setStage("opening");
  invitation.textContent = "";
  window.setTimeout(() => setStage("crossing"), 900);
  window.setTimeout(() => setStage("room"), 2100);
});

document.querySelector('[data-action="gallery"]').addEventListener("click", () => {
  if (stage !== "room") return;
  setStage("gallery");
  currentPhoto = 0;
  updateGallery();

  if (variant === "A") {
    orbitScene.classList.remove("is-settling");
    orbitScene.classList.add("is-preparing");
    orbitScene.style.transform = "rotateY(-135deg)";

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        orbitScene.classList.remove("is-preparing");
        orbitScene.classList.add("is-settling");
        orbitScene.style.transform = "rotateY(0deg)";
        window.setTimeout(() => orbitScene.classList.remove("is-settling"), 1400);
      });
    });
  }
});

document.querySelectorAll("[data-video]").forEach((button) => {
  button.addEventListener("click", () => {
    if (stage !== "room") return;
    videoTitle.textContent = `Local video ${button.dataset.video}`;
    setStage("video");
  });
});

document.querySelectorAll("[data-close-overlay]").forEach((button) => {
  button.addEventListener("click", () => setStage("room"));
});

previousPhoto.addEventListener("click", () => moveGallery(-1));
nextPhoto.addEventListener("click", () => moveGallery(1));

lanternRing.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-photo]");
  if (!button) return;
  currentPhoto = Number(button.dataset.photo);
  updateGallery();
});

galleryOverlay.addEventListener("wheel", (event) => {
  if (stage !== "gallery") return;
  event.preventDefault();
  moveGallery(event.deltaY > 0 || event.deltaX > 0 ? 1 : -1);
}, { passive: false });

galleryOverlay.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;
  dragStartX = event.clientX;
  dragDelta = 0;
  galleryOverlay.setPointerCapture(event.pointerId);
});

galleryOverlay.addEventListener("pointermove", (event) => {
  if (dragStartX === null) return;
  dragDelta = event.clientX - dragStartX;
});

galleryOverlay.addEventListener("pointerup", (event) => {
  if (dragStartX === null) return;
  galleryOverlay.releasePointerCapture(event.pointerId);
  if (Math.abs(dragDelta) > 32) moveGallery(dragDelta < 0 ? 1 : -1);
  dragStartX = null;
  dragDelta = 0;
});

window.addEventListener("resize", () => {
  if (stage === "gallery") updateGallery();
});

window.addEventListener("keydown", (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable) return;

  if (event.key === "Escape" && (stage === "gallery" || stage === "video")) {
    setStage("room");
    return;
  }

  if (event.key === "ArrowLeft") {
    if (stage === "gallery") moveGallery(-1);
    else switchVariant(-1);
  }

  if (event.key === "ArrowRight") {
    if (stage === "gallery") moveGallery(1);
    else switchVariant(1);
  }
});

updateGallery();
setStage("door");
