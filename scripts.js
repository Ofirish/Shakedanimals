// Reddit API endpoint for fetching cute animal videos
const REDDIT_API_URL = 'https://www.reddit.com/r/aww/top.json?limit=100&t=week';

// DOM elements
const fetchButton = document.getElementById('fetchButton');
const redditVideo = document.getElementById('redditVideo');
const noVideoMessage = document.getElementById('noVideoMessage');
const shareButton = document.getElementById('shareButton');
const musicButton = document.getElementById('musicButton');
const relaxingMusic = document.getElementById('relaxingMusic');

// Fetch a random cute animal video from Reddit
fetchButton.addEventListener('click', async () => {
  try {
    // Fetch posts from the Reddit API
    const response = await fetch(REDDIT_API_URL);
    const data = await response.json();

    if (data.data && data.data.children.length > 0) {
      // Filter posts that contain videos
      const postsWithVideos = data.data.children.filter(post => {
        return post.data.is_video || post.data.url.includes('v.redd.it') || post.data.url.includes('youtube.com');
      });

      if (postsWithVideos.length > 0) {
        // Randomly select a post with a video
        const randomPost = postsWithVideos[Math.floor(Math.random() * postsWithVideos.length)];
        const videoUrl = randomPost.data.is_video ? randomPost.data.media.reddit_video.fallback_url : randomPost.data.url;

        // Set the video URL in the <video> element
        redditVideo.src = videoUrl;
        redditVideo.style.display = 'block';
        noVideoMessage.style.display = 'none';
      } else {
        redditVideo.style.display = 'none';
        noVideoMessage.style.display = 'block';
      }
    } else {
      alert('No posts found. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching video:', error);
    alert('Failed to fetch video. Please try again later.');
  }
});

// Share on WhatsApp
shareButton.addEventListener('click', () => {
  const videoUrl = redditVideo.src;
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
