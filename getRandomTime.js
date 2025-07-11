function getRandomTime(duration) {
  const start = duration * 0.1;

  return start + Math.random() * (duration - start);
}
