window.addEventListener('DOMContentLoaded', () => {
  const audio       = document.getElementById('audio-player');
  const titleEl     = document.querySelector('.song-info .title');
  const artistEl    = document.querySelector('.song-info .artist');
  const coverEl     = document.querySelector('.song-info img');

  const playBtn     = document.getElementById('play');
const playPauseIcon = document.getElementById('playPauseIcon');  const likeBtn     = document.getElementById('like');

  const progress    = document.getElementById('progress');
  const currentTime = document.getElementById('current-time');
  const durationEl  = document.getElementById('duration');

  function getLiked() {
    return JSON.parse(localStorage.getItem('vdcl_liked') || '[]');
  }
  function saveLiked(arr) {
    localStorage.setItem('vdcl_liked', JSON.stringify(arr));
  }
  function updateLikeState() {
    const isLiked = getLiked().some(item => item.src === audio.src);
    likeBtn.classList.toggle('liked', isLiked);
  }

  document.querySelectorAll('.quick-access .card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const { src, cover, title, artist } = card.dataset;
      audio.src            = src;
      coverEl.src          = cover;
      coverEl.alt          = title;
      titleEl.textContent  = title;
      artistEl.textContent = artist;
      audio.play();

      playPauseIcon.src = 'imghome/playre.png';
      playPauseIcon.alt = 'Pause';

      updateLikeState();
    });
  });

  // --- PLAY / PAUSE --- //
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playPauseIcon.src = 'imghome/playre.png';
      playPauseIcon.alt = 'Pause';
    } else {
      audio.pause();
      playPauseIcon.src = 'imghome/pausere.png';
      playPauseIcon.alt = 'Play';
    }
  });

  // --- LIKE / UNLIKE --- //
  likeBtn.addEventListener('click', () => {
    const arr = getLiked();
    const idx = arr.findIndex(item => item.src === audio.src);
    if (idx >= 0) {
      arr.splice(idx, 1);
    } else {
      arr.push({
        src:    audio.src,
        cover:  coverEl.src,
        title:  titleEl.textContent,
        artist: artistEl.textContent
      });
    }
    saveLiked(arr);
    updateLikeState();
  });

  // --- METADATA & TIMELINE --- //
  audio.addEventListener('loadedmetadata', () => {
    progress.max = Math.floor(audio.duration);
    durationEl.textContent = formatTime(audio.duration);
    updateLikeState();
  });

  audio.addEventListener('timeupdate', () => {
    progress.value = Math.floor(audio.currentTime);
    currentTime.textContent = formatTime(audio.currentTime);
  });

  progress.addEventListener('input', () => {
    audio.currentTime = progress.value;
  });

  // --- format mm:ss --- //
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }
});

const userBtn  = document.getElementById('userBtn');
const userMenu = document.getElementById('userMenu');

userBtn.addEventListener('click', e => {
  e.stopPropagation();
  userMenu.classList.toggle('show');
});

document.addEventListener('click', () => {
  userMenu.classList.remove('show');
});
