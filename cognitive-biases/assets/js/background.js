/* ==========================================================================
   Cognitive Bias Atlas — background.js
   A single shared component that mounts the full-screen background video at
   the layout root (<body>), rather than duplicating markup in every page.

   The video sits behind every other layer (the dark gradient, the coloured
   blobs and the grid texture all stack above it via z-index), so content
   stays readable while the video moves behind it. It is decorative:
   muted, looped, plays-inline, and hidden for users who prefer reduced motion.

   Continuous playback is enforced three ways:
     1. `muted`/`playsinline`/`loop`/`autoplay` are set as properties (not just
        attributes) before play(), which is what autoplay policies key on.
     2. If autoplay is still blocked, playback starts on the first user
        interaction (tap / key / scroll).
     3. The video is resumed if it pauses for any reason or when the tab is
        brought back to the foreground.
   ========================================================================== */
(function () {
  "use strict";

  if (document.querySelector(".bg-video")) return; // idempotent across re-runs

  var wrap = document.createElement("div");
  wrap.className = "bg-video";
  wrap.setAttribute("aria-hidden", "true");

  var video = document.createElement("video");
  // Properties first — these are what browsers read for the autoplay policy.
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  // Attributes mirror the properties (and help server-rendered tooling).
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("preload", "auto");
  video.setAttribute("disablepictureinpicture", "");
  video.setAttribute("disableRemotePlayback", "");
  video.src = "assets/media/background.mp4";

  wrap.appendChild(video);
  document.body.insertBefore(wrap, document.body.firstChild);

  var retried = false;

  function tryPlay() {
    var playing = null;
    try {
      playing = typeof video.play === "function" ? video.play() : null;
    } catch (err) {
      playing = null;
    }
    if (playing && typeof playing.catch === "function") {
      playing.catch(function () {
        wrap.classList.add("is-blocked");
        bindRetry();
      });
    }
  }

  // Autoplay blocked? Start on the first interaction instead (fired once).
  function bindRetry() {
    if (retried) return;
    retried = true;
    ["pointerdown", "touchstart", "keydown", "scroll"].forEach(function (type) {
      document.addEventListener(type, tryPlay, { once: true, passive: true });
    });
  }

  // Never let it stop: resume on any pause and when the tab is visible again.
  video.addEventListener("pause", function () {
    if (!document.hidden) tryPlay();
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && video.paused) tryPlay();
  });

  tryPlay();
})();
