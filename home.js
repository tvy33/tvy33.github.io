// home.js
// Audio player controls: play/pause toggle, progress bar, and volume mute

document.addEventListener('DOMContentLoaded', () => {
  // Create audio instance and set source to your MP3 file
  const audio = new Audio('dapmocuoctinh.mp3');
  audio.preload = 'metadata';

  // Get DOM elements
  const playBtn = document.getElementById('play');
  const progress = document.getElementById('progress');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const volumeBtn = document.getElementById('volume');

  // When metadata is loaded, set duration
  audio.addEventListener('loadedmetadata', () => {
    const dur = Math.floor(audio.duration);
    progress.max = dur;
    durationEl.textContent = formatTime(dur);
  });

  // Update progress and current time as audio plays
  audio.addEventListener('timeupdate', () => {
    const ct = Math.floor(audio.currentTime);
    progress.value = ct;
    currentTimeEl.textContent = formatTime(ct);
  });

  // Play/pause toggle
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '⏸️';
    } else {
      audio.pause();
      playBtn.textContent = '▶️';
    }
  });

  // Seek when user moves the progress slider
  progress.addEventListener('input', () => {
    audio.currentTime = progress.value;
  });

  // Mute/unmute toggle
  volumeBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    volumeBtn.textContent = audio.muted ? '🔇' : '🔉';
  });

  // Helper: format seconds -> mm:ss
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
});
