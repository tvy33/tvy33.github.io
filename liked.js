window.addEventListener('DOMContentLoaded', () => {
  const tbody       = document.getElementById('songsList');
  const searchInput = document.getElementById('search');
  const liked       = JSON.parse(localStorage.getItem('vdcl_liked') || '[]');

  function renderSongs(songs) {
    tbody.innerHTML = '';
    if (!songs.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4" style="text-align:center; padding:20px; color:#777;">
                        No liked songs found.
                      </td>`;
      tbody.appendChild(tr);
      return;
    }

    songs.forEach((item, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td class="cover-cell">
          <div class="song-title-wrapper">
            <img src="${item.cover}" alt="${item.title}" />
            <div class="info">
              <div class="title">${item.title}</div>
              <div class="artist">${item.artist}</div>
            </div>
          </div>
        </td>
        <td>${item.album || ''}</td>
        <td>${item.duration || ''}</td>
      `;
      tr.addEventListener('click', () => {
        sessionStorage.setItem('vdcl_current', JSON.stringify(item));
        window.location.href = 'home.html';
      });
      tbody.appendChild(tr);
    });
  }

  // Render lần đầu
  renderSongs(liked);

  // Search filter
  searchInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = liked.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.artist.toLowerCase().includes(q)
    );
    renderSongs(filtered);
  });
});
