// Fetch a random cute animal photo from Unsplash
const fetchButton = document.getElementById('fetchButton');
const animalImage = document.getElementById('animalImage');
const animalVideo = document.getElementById('animalVideo');
const shareButton = document.getElementById('shareButton');
const musicButton = document.getElementById('musicButton');
const relaxingMusic = document.getElementById('relaxingMusic');

fetchButton.addEventListener('click', async () => {
  try {
    const response = await fetch('https://source.unsplash.com/600x400/?cute-animal');
    animalImage.src = response.url;
    animalImage.style.display = 'block';
    animalVideo.style.display = 'none';
  } catch (error) {
    console.error('Error fetching image:', error);
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

// Play relaxing music
musicButton.addEventListener('click', () => {
  if (relaxingMusic.paused) {
    relaxingMusic.play();
    musicButton.textContent = '🎵';
  } else {
    relaxingMusic.pause();
    musicButton.textContent = '🎵';
  }
});