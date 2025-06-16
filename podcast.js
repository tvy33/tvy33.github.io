function playEpisode(title) {
  const nowPlaying = document.getElementById('nowPlaying');
  nowPlaying.textContent = title;
  // You can integrate audio player logic here
  console.log(`Playing: ${title}`);
}
