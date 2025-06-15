window.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audio-player');
  const titleEl = document.querySelector('.song-info .title');
  const artistEl = document.querySelector('.song-info .artist');
  const coverEl  = document.querySelector('.song-info img');
  const playBtn  = document.getElementById('play');

  // Gán click cho từng card quick-access qua data-attributes
  document.querySelectorAll('.quick-access .card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const { src, cover, title, artist } = card.dataset;
      audio.src = src;
      coverEl.src = cover;
      coverEl.alt = title;
      titleEl.textContent = title;
      artistEl.textContent = artist;
      audio.play();
      playBtn.textContent = '⏸️';
    });
  });

  // Play / Pause toggle
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '⏸️';
    } else {
      audio.pause();
      playBtn.textContent = '▶️';
    }
  });

  // Timeline & time display
  const progress      = document.getElementById('progress');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl    = document.getElementById('duration');

  audio.addEventListener('loadedmetadata', () => {
    progress.max = Math.floor(audio.duration);
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    progress.value = Math.floor(audio.currentTime);
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  progress.addEventListener('input', () => {
    audio.currentTime = progress.value;
  });

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
});