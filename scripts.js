// Predefined list of cute animal YouTube video IDs
const cuteAnimalVideos = [
  'dQw4w9WgXcQ', // Example video ID (replace with actual IDs)
  'kJQP7kiw5Fk',
  'RgKAFK5djSk',
  'OPf0YbXqDm0',
  'CevxZvSJLk8'
];

// DOM elements
const fetchButton = document.getElementById('fetchButton');
const youtubeVideo = document.getElementById('youtubeVideo');
const noVideoMessage = document.getElementById('noVideoMessage');
const shareButton = document.getElementById('shareButton');
const musicButton = document.getElementById('musicButton');
const relaxingMusic = document.getElementById('relaxingMusic');

// Fetch a random cute animal video from the predefined list
fetchButton.addEventListener('click', () => {
  if (cuteAnimalVideos.length > 0) {
    // Randomly select a video ID
    const randomVideoId = cuteAnimalVideos[Math.floor(Math.random() * cuteAnimalVideos.length)];
    const videoUrl = `https://www.youtube.com/embed/${randomVideoId}?autoplay=1`;

    // Set the video URL in the iframe
    youtubeVideo.src = videoUrl;
    youtubeVideo.style.display = 'block';
    noVideoMessage.style.display = 'none';
  } else {
    youtubeVideo.style.display = 'none';
    noVideoMessage.style.display = 'block';
  }
});

// Share on WhatsApp
shareButton.addEventListener('click', () => {
  const videoUrl = youtubeVideo.src;
  if (videoUrl) {
    const shareUrl = `https://api.whatsapp.com/send?text=Check out this cute animal video! ${videoUrl}`;
    window.open(shareUrl, '_blank');
  } else {
    alert('Please fetch a cute animal video first!');
  }
});

// Play or pause relaxing music
musicButton.addEventListener('click', () => {
  if (relaxingMusic.paused) {
    relaxingMusic.play();
    musicButton.textContent = '🎵';
  } else {
    relaxingMusic.pause();
    musicButton.textContent = '🎵';
  }
});
