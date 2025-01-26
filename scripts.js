// Fetch a random cute animal video from Pexels
const fetchButton = document.getElementById('fetchButton');
const animalImage = document.getElementById('animalImage');
const animalVideo = document.getElementById('animalVideo');
const shareButton = document.getElementById('shareButton');
const musicButton = document.getElementById('musicButton');
const relaxingMusic = document.getElementById('relaxingMusic');

// Pexels API key (replace with your own key)
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY'; // Get it from https://www.pexels.com/api/

fetchButton.addEventListener('click', async () => {
  try {
    // Fetch a random cute animal video from Pexels
    const response = await fetch('https://api.pexels.com/videos/search?query=cute+animals&per_page=1', {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    const data = await response.json();
    if (data.videos && data.videos.length > 0) {
      const videoUrl = data.videos[0].video_files[0].link; // Get the first video URL
      animalVideo.src = videoUrl;
      animalVideo.style.display = 'block';
      animalImage.style.display = 'none';
    } else {
      alert('No videos found. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching video:', error);
    alert('Failed to fetch video. Please check your API key or try again later.');
  }
});

// Share on WhatsApp
shareButton.addEventListener('click', () => {
  const mediaUrl = animalImage.src || animalVideo.src;
  if (mediaUrl) {
    const shareUrl = `https://api.whatsapp.com/send?text=Check out this cute animal! ${mediaUrl}`;
    window.open(shareUrl, '_blank');
  } else {
    alert('Please fetch a cute animal first!');
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
