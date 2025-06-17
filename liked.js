window.addEventListener('DOMContentLoaded', () => {
  const tbody         = document.getElementById('songsList');
  const searchInput   = document.getElementById('search');
  const liked         = JSON.parse(localStorage.getItem('vdcl_liked') || '[]');

  const audio          = document.getElementById('audio-player');
  const coverBar       = document.getElementById('coverBar');
  const titleBar       = document.getElementById('titleBar');
  const artistBar      = document.getElementById('artistBar');
  const btnPlay        = document.getElementById('btnPlay');
  const playPauseIcon  = document.getElementById('playPauseIcon');
  const btnShuffle     = document.getElementById('btnShuffle');
  const btnPrev        = document.getElementById('btnPrev');
  const btnNext        = document.getElementById('btnNext');
  const btnLike        = document.getElementById('btnLike');
  const progressBar    = document.getElementById('progressBar');
  const curTime        = document.getElementById('curTime');
  const durTime        = document.getElementById('durTime');
  const playerBar      = document.getElementById('playerBar');

  // Format seconds → m:ss
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  audio.addEventListener('loadedmetadata', () => {
    progressBar.max     = Math.floor(audio.duration);
    durTime.textContent = formatTime(audio.duration);
  });

  // Cập nhật progress & thời gian hiện tại
  audio.addEventListener('timeupdate', () => {
    progressBar.value   = Math.floor(audio.currentTime);
    curTime.textContent = formatTime(audio.currentTime);
  });

  // Kéo thanh tiến độ
  progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
  });

  // Play / Pause toggle
  btnPlay.addEventListener('click', () => {
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

  // Render danh sách bài
  function render(list) {
    tbody.innerHTML = '';
    if (!list.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="4" style="text-align:center;padding:20px;color:#777">
          No liked songs found.
        </td>`;
      tbody.appendChild(tr);
      return;
    }
    list.forEach((item, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td class="cover-cell">
          <div class="song-title-wrapper">
            <img src="${item.cover}" alt="${item.title}">
            <div class="info">
              <div class="title">${item.title}</div>
              <div class="artist">${item.artist}</div>
            </div>
          </div>
        </td>
        <td>${item.album || ''}</td>
        <td>${item.duration || ''}</td>`;
      tr.addEventListener('click', () => {
        // Hiện player bar và phát
        playerBar.style.display = 'flex';
        coverBar.src            = item.cover;
        titleBar.textContent    = item.title;
        artistBar.textContent   = item.artist;
        audio.src               = item.src;
        audio.play();
        // Chuyển icon thành Pause
        playPauseIcon.src       = 'imghome/playre.png';
        playPauseIcon.alt       = 'Pause';
      });
      tbody.appendChild(tr);
    });
  }

  // Lần đầu render
  render(liked);

  // Filter khi search
  searchInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    render(
      liked.filter(x =>
        x.title.toLowerCase().includes(q) ||
        x.artist.toLowerCase().includes(q)
      )
    );
  });

  // Like / Unlike
  btnLike.addEventListener('click', () => {
    let arr = JSON.parse(localStorage.getItem('vdcl_liked') || '[]');
    const idx = arr.findIndex(x => x.src === audio.src);
    if (idx >= 0) {
      arr.splice(idx, 1);
    } else {
      arr.push({
        src:      audio.src,
        cover:    coverBar.src,
        title:    titleBar.textContent,
        artist:   artistBar.textContent,
        album:    '',
        duration: durTime.textContent
      });
    }
    localStorage.setItem('vdcl_liked', JSON.stringify(arr));
    btnLike.classList.toggle('liked', idx < 0);
    render(arr);
  });

  // Dropdown TLTV
  const userBtn  = document.getElementById('userBtn');
  const userMenu = document.getElementById('userMenu');
  userBtn.addEventListener('click', e => {
    e.stopPropagation();
    userMenu.classList.toggle('show');
  });
  userMenu.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => userMenu.classList.remove('show'));
});
