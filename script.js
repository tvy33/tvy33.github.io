const focusPlaylists = [
  {
    title: 'Peaceful Piano',
    desc: 'Relax and indulge with beautiful piano pieces.',
    img: 'imghome/piano.png'
  },
  {
    title: 'Deep Focus',
    desc: 'Keep calm and focus with ambient and post-',
    img: 'assets/deepfocus.jpg'
  },
  {
    title: 'Instrumental Study',
    desc: 'Soft study music in the background.',
    img: 'imghome/swm.jpg'
  }
];

const vdlcPlaylists = [
  {
    title: 'Today\'s Top Hits',
    desc: 'Ed Sheeran is on top of the world.',
    img: 'imghome/ptg.jpg'
  },
  {
    title: 'Rap GOAT!!!',
    desc: 'New music from EMINEM.',
    img: 'assets/eminem.jpg'
  },
  {
    title: 'Road To Glory',
    desc: 'The biggest songs of victory.',
    img: 'assets/glory.jpg'
  }
];

function renderPlaylists(containerId, playlists) {
  const container = document.getElementById(containerId);
  playlists.forEach(p => {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.innerHTML = `
      <img src=\"${p.img}\" alt=\"${p.title}\">
      <div class=\"info\">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

renderPlaylists('focus-playlists', focusPlaylists);
renderPlaylists('vdlc-playlists', vdlcPlaylists);
