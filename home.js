window.addEventListener('DOMContentLoaded', () => {
  // === ELEMENTS ===
  const audio         = document.getElementById('audio-player');
  const coverEl       = document.querySelector('.song-info img');
  const titleEl       = document.querySelector('.song-info .title');
  const artistEl      = document.querySelector('.song-info .artist');
  const albumEl       = document.querySelector('.song-info .album'); // nếu có
  const playBtn       = document.getElementById('play');
  const playIcon      = document.getElementById('playPauseIcon');
  const likeBtn       = document.getElementById('like');
  const progressBar   = document.getElementById('progress');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl    = document.getElementById('duration');
  const prevBtn       = document.getElementById('prev');
  const nextBtn       = document.getElementById('next');
  const userBtn       = document.getElementById('userBtn');
  const userMenu      = document.getElementById('userMenu');

  // === HELPERS ===
  function formatTime(sec) {
    const m = Math.floor(sec/60),
          s = String(Math.floor(sec%60)).padStart(2,'0');
    return `${m}:${s}`;
  }
  function getLiked() {
    return JSON.parse(localStorage.getItem('vdcl_liked') || '[]');
  }
  function saveLiked(list) {
    localStorage.setItem('vdcl_liked', JSON.stringify(list));
  }
  function updateLikeState() {
    const isLiked = getLiked().some(x => x.src === audio.src);
    likeBtn.classList.toggle('liked', isLiked);
  }

  // === BUILD PLAYLIST ===
  const cards = Array.from(document.querySelectorAll('.quick-access .card'))
                     .filter(c => c.dataset.src);
  const trackList = cards.map(c => ({
    src:    c.dataset.src,
    cover:  c.dataset.cover,
    title:  c.dataset.title,
    artist: c.dataset.artist,
    album:  c.dataset.album || ''
  }));
  let currentIndex = 0;

  // === LOAD TRACK ===
  function loadTrack(idx) {
    const t = trackList[idx];
    audio.src            = t.src;
    audio.load();                            // ← Nạp nguồn mới
    coverEl.src          = t.cover;
    coverEl.alt          = t.title;
    titleEl.textContent  = t.title;
    artistEl.textContent = t.artist;
    if (albumEl) albumEl.textContent = t.album;
    updateLikeState();
  }
  if (trackList.length) loadTrack(0);

  // === CARD CLICK ===
  cards.forEach((card, i) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      currentIndex = i;
      loadTrack(i);
      audio.play();
      playIcon.src = 'imghome/playre.png';
      playIcon.alt = 'Pause';
    });
  });

  // === PLAY / PAUSE ===
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playIcon.src = 'imghome/playre.png';
      playIcon.alt = 'Pause';
    } else {
      audio.pause();
      playIcon.src = 'imghome/pausere.png';
      playIcon.alt = 'Play';
    }
  });

  // === PREV / NEXT ===
  prevBtn.addEventListener('click', () => {
    if (!trackList.length) return;
    currentIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    loadTrack(currentIndex);
    audio.play();
  });
  nextBtn.addEventListener('click', () => {
    if (!trackList.length) return;
    currentIndex = (currentIndex + 1) % trackList.length;
    loadTrack(currentIndex);
    audio.play();
  });
  audio.addEventListener('ended', () => nextBtn.click());

  // === TIMELINE ===
  audio.addEventListener('loadedmetadata', () => {
    progressBar.max        = Math.floor(audio.duration);
    durationEl.textContent = formatTime(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    progressBar.value            = Math.floor(audio.currentTime);
    currentTimeEl.textContent    = formatTime(audio.currentTime);
  });
  progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
  });

  // === LIKE / UNLIKE FIXED ===
  likeBtn.addEventListener('click', () => {
    const list = getLiked();
    const idx  = list.findIndex(x => x.src === audio.src);
    if (idx >= 0) {
      // Unlike
      list.splice(idx, 1);
    } else {
      // Like: lưu chính xác audio.src (absolute) để update dễ dàng
      list.push({
        src:    audio.src,
        cover:  coverEl.src,
        title:  titleEl.textContent,
        artist: artistEl.textContent,
        album:  albumEl ? albumEl.textContent : ''
      });
    }
    saveLiked(list);
    updateLikeState();
  });

  // === DROPDOWN USER ===
  userBtn.addEventListener('click', e => {
    e.stopPropagation();
    userMenu.classList.toggle('show');
  });
  userMenu.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => userMenu.classList.remove('show'));
});
