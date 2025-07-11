const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      const play = () => {
        video.currentTime = getRandomTime(video.duration);

        video.play().catch((error) => error);
      };

      if (entry.isIntersecting) {
        if (video.readyState >= 1) {
          play();
        } else {
          video.onloadedmetadata = play;
        }
      } else {
        video.pause();
      }
    });
  },
  {
    threshold: 0.2,
  }
);
