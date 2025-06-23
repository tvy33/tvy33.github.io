window.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'vdcl_liked';
  // Mapping title → album
  const ALBUM_MAP = {
    'Paris In The Rain':        'I Met You When I Was 18 (The Playlist)',
    'Young and Beautiful':      'The Great Gatsby: Music from Baz Luhrmann\'s Film',
    'Vùng ký ức':               'Vùng ký ức (Single)',
    'Canon in D':               'Canon and Gigue for 3 violins and basso continuo',
    'Beethoven':                'Beethoven: Complete Symphonies',
    'So Bad':                   'VSTRA (feat. TGSN & Tyronee)',
    '50 Feet':                  '50 Feet (Single)',
    'Photograph':               '× (Multiply)',
    'ROSS AND RACHEL':          'ROSS AND RACHEL (Single)',
    'Happier':                  '÷ (Divide)'
  };

  // --- ELEMENTS ---
  const tbody       = document.getElementById('songsList');
  const searchInput = document.getElementById('search');
  const playerBar   = document.getElementById('playerBar');

  const coverBar     = document.getElementById('coverBar');
  const titleBar     = document.getElementById('titleBar');
  const artistBar    = document.getElementById('artistBar');
  const albumBar     = document.getElementById('albumBar');

  const btnShuffle   = document.getElementById('btnShuffle');
  const btnPrev      = document.getElementById('btnPrev');
  const btnPlay      = document.getElementById('btnPlay');
  const playIcon     = document.getElementById('playPauseIcon');
  const btnNext      = document.getElementById('btnNext');
  const btnLike      = document.getElementById('btnLike');

  const progressBar  = document.getElementById('progressBar');
  const curTimeEl    = document.getElementById('curTime');
  const durTimeEl    = document.getElementById('durTime');
  const audio        = document.getElementById('audio-player');

  const userBtn      = document.getElementById('userBtn');
  const userMenu     = document.getElementById('userMenu');

  // --- STATE ---
  let playlist = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  // loại bỏ duplicate
  playlist = playlist.filter((v,i,a)=>a.findIndex(x=>x.src===v.src)===i);
  let currentIndex = -1;

  // --- HELPERS ---
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlist));
  }
  function formatTime(sec) {
    const m = Math.floor(sec/60), s = String(Math.floor(sec%60)).padStart(2,'0');
    return `${m}:${s}`;
  }
  function updateLikeIcon() {
    const liked = playlist.some(x=>x.src===audio.src);
    btnLike.classList.toggle('liked', liked);
  }

  // --- RENDER TABLE ---
  function render(list) {
    tbody.innerHTML = '';
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#777">
        No liked songs found.
      </td></tr>`;
      return;
    }
    list.forEach((item,i) => {
      // fill album nếu trống
      if (!item.album && ALBUM_MAP[item.title]) {
        item.album = ALBUM_MAP[item.title];
        save();
      }
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i+1}</td>
        <td class="cover-cell">
          <div class="song-title-wrapper">
            <img src="${item.cover}" alt="${item.title}" width="40" height="40" style="margin-right:10px;">
            <div>
              <div class="title">${item.title}</div>
              <div class="artist">${item.artist}</div>
            </div>
          </div>
        </td>
        <td>${item.album||''}</td>
        <td>${item.duration||''}</td>`;
      tr.addEventListener('click', () => {
        currentIndex = i;
        loadTrack(i);
        audio.play();
      });
      tbody.appendChild(tr);
    });
  }

  // --- LOAD & SHOW TRACK ---
  function loadTrack(idx) {
    const item = playlist[idx];
    coverBar.src           = item.cover;
    coverBar.alt           = item.title;
    titleBar.textContent   = item.title;
    artistBar.textContent  = item.artist;
    albumBar.textContent   = item.album||'';
    audio.src              = item.src;
    audio.load();
    playerBar.style.display = 'flex';
    updateLikeIcon();
  }

  function playTrack() {
    audio.play();
    playIcon.src = 'imghome/playre.png';
    playIcon.alt = 'Pause';
  }

  // --- CONTROLS ---
  btnPlay.addEventListener('click', () => {
    if (audio.paused) playTrack();
    else {
      audio.pause();
      playIcon.src = 'imghome/pausere.png';
      playIcon.alt = 'Play';
    }
  });

  btnPrev.addEventListener('click', () => {
    if (!playlist.length) return;
    currentIndex = (currentIndex-1+playlist.length)%playlist.length;
    loadTrack(currentIndex);
    playTrack();
  });
  btnNext.addEventListener('click', () => {
    if (!playlist.length) return;
    currentIndex = (currentIndex+1)%playlist.length;
    loadTrack(currentIndex);
    playTrack();
  });
  audio.addEventListener('ended', () => btnNext.click());

  btnShuffle.addEventListener('click', () => {
    playlist = playlist.sort(() => 0.5 - Math.random());
    currentIndex = 0;
    loadTrack(0);
    playTrack();
    save();
    render(playlist);
  });

  audio.addEventListener('loadedmetadata', () => {
    progressBar.max      = Math.floor(audio.duration);
    durTimeEl.textContent = formatTime(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    progressBar.value       = Math.floor(audio.currentTime);
    curTimeEl.textContent   = formatTime(audio.currentTime);
  });
  progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
  });

  // --- LIKE / UNLIKE + REMOVE ROW ---
  btnLike.addEventListener('click', () => {
    const src = audio.src;
    const idx = playlist.findIndex(x=>x.src===src);
    if (idx>=0) {
      // remove from list
      playlist.splice(idx,1);
      save();
      render(playlist);
      // nếu vẫn còn bài, load tiếp index idx (or 0)
      if (playlist.length) {
        currentIndex = Math.min(idx, playlist.length-1);
        loadTrack(currentIndex);
      } else {
        playerBar.style.display = 'none';
      }
    }
    updateLikeIcon();
  });

  // --- SEARCH ---
  searchInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    render( playlist.filter(x=>
      x.title.toLowerCase().includes(q)||
      x.artist.toLowerCase().includes(q)
    ));
  });

  // --- DROPDOWN USER ---
  userBtn.addEventListener('click', e => {
    e.stopPropagation();
    userMenu.classList.toggle('show');
  });
  userMenu.addEventListener('click', e=>e.stopPropagation());
  document.addEventListener('click', ()=>userMenu.classList.remove('show'));

  // --- INIT: render + load first track + red heart ---
  render(playlist);
  if (playlist.length) {
    currentIndex = 0;
    loadTrack(0);
  }
});
