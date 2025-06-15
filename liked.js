// liked.js
window.addEventListener('DOMContentLoaded', () => {
  const listEl      = document.getElementById('songsList');
  const searchInput = document.getElementById('search');
  // Đọc mảng liked songs
  const liked       = JSON.parse(localStorage.getItem('vdcl_liked') || '[]');

  // Hàm render danh sách bài
  function renderSongs(songs) {
    listEl.innerHTML = '';
    if (!songs.length) {
      listEl.innerHTML = '<p>No liked songs found.</p>';
      return;
    }
    songs.forEach(item => {
      const card = document.createElement('div');
      card.className = 'song-card';
      card.innerHTML = `
        <img src="${item.cover}" alt="${item.title}" class="song-cover">
        <div class="song-info">
          <div class="title">${item.title}</div>
          <div class="artist">${item.artist}</div>
        </div>
      `;
      // Khi click → lưu vào session + về home
      card.addEventListener('click', () => {
        sessionStorage.setItem('vdcl_current', JSON.stringify(item));
        window.location.href = 'home.html';
      });
      listEl.appendChild(card);
    });
  }

  // 1) Render toàn bộ lần đầu
  renderSongs(liked);

  // 2) Filter theo search
  searchInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = liked.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.artist.toLowerCase().includes(q)
    );
    renderSongs(filtered);
  });
});
