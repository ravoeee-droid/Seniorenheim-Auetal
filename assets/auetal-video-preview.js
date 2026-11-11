/* Auetal Arbeitgeberfilm: frame preview from the actual MP4, no unrelated staff photo.
   Respect motion preferences. Never autoplay with sound. */
(() => {
  'use strict';
  const player = document.querySelector('[data-film-player]');
  if (!player) return;
  const video = player.querySelector('video');
  const startButton = player.querySelector('[data-film-start]');
  if (!video || !startButton) return;

  const originalSrc = video.querySelector('source')?.src || '';
  let started = false;

  const revealRealFrame = () => {
    if (!started && video.videoWidth > 0) {
      player.classList.add('film-has-frame');
    }
  };

  video.addEventListener('loadedmetadata', () => {
    if (started) return;
    try {
      // A paused actual video frame is the thumbnail; nothing fabricated.
      const duration = video.duration;
      const frameTime = Number.isFinite(duration) && duration > 0.5
        ? Math.min(0.7, duration - 0.1)
        : 0.1;
      if (video.seekable.length || Number.isFinite(duration)) {
        video.currentTime = frameTime;
      }
    } catch (_) {
      // The branded preview remains usable until the user presses play.
    }
  }, {once:true});

  video.addEventListener('seeked', revealRealFrame);
  video.addEventListener('loadeddata', revealRealFrame);

  const launch = () => {
    started = true;
    try { video.currentTime = 0; } catch (_) {}
    player.classList.add('film-is-playing');
    video.play().catch(() => {
      started = false;
      player.classList.remove('film-is-playing');
      // Native controls are still available in the video element.
      video.controls = true;
      video.focus({preventScroll:true});
    });
  };

  startButton.addEventListener('click', launch);
  video.addEventListener('playing', () => player.classList.add('film-is-playing'));
  video.addEventListener('error', () => {
    if (started) return;
    player.classList.add('film-unavailable');
    const label = startButton.querySelector('.film-preview__label');
    if (label) label.textContent = 'Video direkt öffnen';
  });
  startButton.addEventListener('click', () => {
    if (player.classList.contains('film-unavailable') && originalSrc) {
      window.open(originalSrc.split('#')[0], '_blank', 'noopener,noreferrer');
    }
  });
})();
