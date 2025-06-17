window.addEventListener('DOMContentLoaded', () => {
  const tbody       = document.getElementById('songsList');
  const searchInput = document.getElementById('search');
  const liked       = JSON.parse(localStorage.getItem('vdcl_liked') || '[]');

  // Player elements
  const audio     = document.getElementById('audio-player');
  const coverBar  = document.getElementById('coverBar');
  const titleBar  = document.getElementById('titleBar');
  const artistBar = document.getElementById('artistBar');
  const btnPlay   = document.getElementById('btnPlay');
  const btnLike   = document.getElementById('btnLike');
  const progress  = document.getElementById('progressBar');
  const curTime   = document.getElementById('curTime');
  const durTime   = document.getElementById('durTime');
  const bar       = document.getElementById('playerBar');

  function formatTime(sec) {
    const m = Math.floor(sec/60);
    const s = Math.floor(sec%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  function playSong(item) {
    bar.style.display = 'flex';
    coverBar.src = item.cover;
    titleBar.textContent = item.title;
    artistBar.textContent = item.artist;
    audio.src = item.src;    // item.src phải có đường dẫn MP3
    audio.play();
    btnPlay.textContent = '⏸️';
  }

  function render(songs) {
    tbody.innerHTML = '';
    if (!songs.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4" style="text-align:center; padding:20px; color:#777;">
                        No liked songs found.
                      </td>`;
      tbody.appendChild(tr);
      return;
    }
    songs.forEach((it,i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i+1}</td>
        <td class="cover-cell">
          <div class="song-title-wrapper">
            <img src="${it.cover}" alt="${it.title}">
            <div class="info">
              <div class="title">${it.title}</div>
              <div class="artist">${it.artist}</div>
            </div>
          </div>
        </td>
        <td>${it.album||''}</td>
        <td>${it.duration||''}</td>`;
      tr.addEventListener('click', () => playSong(it));
      tbody.appendChild(tr);
    });
  }

  render(liked);

  searchInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    render(liked.filter(x =>
      x.title.toLowerCase().includes(q) ||
      x.artist.toLowerCase().includes(q)
    ));
  });

  // audio events
  audio.addEventListener('loadedmetadata', () => {
    progress.max = Math.floor(audio.duration);
    durTime.textContent = formatTime(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    progress.value = Math.floor(audio.currentTime);
    curTime.textContent = formatTime(audio.currentTime);
  });
  progress.addEventListener('input', () => {
    audio.currentTime = progress.value;
  });

  // play/pause
  btnPlay.addEventListener('click', () => {
    if (audio.paused) {
      audio.play(); btnPlay.textContent = '⏸️';
    } else {
      audio.pause(); btnPlay.textContent = '▶️';
    }
  });

  // like/unlike
  btnLike.addEventListener('click', () => {
    let arr = JSON.parse(localStorage.getItem('vdcl_liked')||'[]');
    const idx = arr.findIndex(x=>x.src===audio.src);
    if (idx>=0) arr.splice(idx,1);
    else arr.push({
      src: audio.src,
      cover: coverBar.src,
      title: titleBar.textContent,
      artist: artistBar.textContent
    });
    localStorage.setItem('vdcl_liked', JSON.stringify(arr));
    btnLike.classList.toggle('liked', idx<0);
    render(arr);
  });

  // user-menu (giữ nguyên)
  const userBtn  = document.getElementById('userBtn');
  const userMenu = document.getElementById('userMenu');
  userBtn.addEventListener('click', e => {
    e.stopPropagation(); userMenu.classList.toggle('show');
  });
  userMenu.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => userMenu.classList.remove('show'));
});
