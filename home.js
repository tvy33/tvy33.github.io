window.addEventListener('DOMContentLoaded', () => {
  const audio       = document.getElementById('audio-player');
  const titleEl     = document.querySelector('.song-info .title');
  const artistEl    = document.querySelector('.song-info .artist');
  const coverEl     = document.querySelector('.song-info img');
  const playBtn     = document.getElementById('play');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const likeBtn     = document.getElementById('like');
  const progress    = document.getElementById('progress');
  const currentTime = document.getElementById('current-time');
  const durationEl  = document.getElementById('duration');

  // --- helper like/unlike  ---
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
    if (!card.dataset.src) return; 
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      audio.src            = card.dataset.src;
      coverEl.src          = card.dataset.cover;
      coverEl.alt          = card.dataset.title;
      titleEl.textContent  = card.dataset.title;
      artistEl.textContent = card.dataset.artist;
      audio.play();
      playPauseIcon.src = 'imghome/playre.png';
      playPauseIcon.alt = 'Pause';
      updateLikeState();
    });
  });

  // --- PLAY / PAUSE ---
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
  // --- LIKE / UNLIKE ---
  likeBtn.addEventListener('click', () => {
    const arr = getLiked();
    const idx = arr.findIndex(item => item.src === audio.src);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push({
      src:    audio.src,
      cover:  coverEl.src,
      title:  titleEl.textContent,
      artist: artistEl.textContent
    });
    saveLiked(arr);
    updateLikeState();
  });
  // --- METADATA & TIMELINE ---
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
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }
  // --- TẠO PLAYLIST từ quick-access cards ---
  const cards = Array.from(document.querySelectorAll('.quick-access .card'))
                    .filter(c => c.dataset.src);
  const trackList = cards.map(c => ({
    src:    c.dataset.src,
    cover:  c.dataset.cover,
    title:  c.dataset.title,
    artist: c.dataset.artist
  }));
  let currentIndex = 0;
  // Hàm load bài từ playlist
  function loadTrack(idx) {
    const t = trackList[idx];
    audio.src            = t.src;
    coverEl.src          = t.cover;
    coverEl.alt          = t.title;
    titleEl.textContent  = t.title;
    artistEl.textContent = t.artist;
    updateLikeState();
  }

  if (trackList.length) {
    loadTrack(currentIndex);
  }

  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  prevBtn.addEventListener('click', () => {
    if (!trackList.length) return;
    currentIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    loadTrack(currentIndex);
    audio.play();
    playPauseIcon.src = 'imghome/playre.png';
    playPauseIcon.alt = 'Pause';
  });

  nextBtn.addEventListener('click', () => {
    if (!trackList.length) return;
    currentIndex = (currentIndex + 1) % trackList.length;
    loadTrack(currentIndex);
    audio.play();
    playPauseIcon.src = 'imghome/playre.png';
    playPauseIcon.alt = 'Pause';
  });

  audio.addEventListener('ended', () => nextBtn.click());
});
