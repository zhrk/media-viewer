const dialog = document.querySelector('dialog');

let currentIndex = null;

function openInViewer(index) {
  currentIndex = index;

  const { url, type } = mediaFiles[index];

  const element = type.startsWith('image/')
    ? document.createElement('img')
    : document.createElement('video');

  if (type.startsWith('video/')) {
    element.controls = true;
    element.autoplay = true;
    element.loop = true;
    element.volume = 0.1;
    element.onloadedmetadata = () => {
      const currentTime = grid.children[index].currentTime;

      element.currentTime = currentTime || getRandomTime(element.duration);
    };
  }

  element.src = url;

  dialog.replaceChildren(element);
  dialog.showModal();
}

function updateCurrentIndex(next) {
  const total = mediaFiles.length;

  if (next) {
    const newIndex = (currentIndex + 1) % total;

    currentIndex = newIndex ? newIndex : total - 1;
  } else {
    const newIndex = (currentIndex - 1 + total) % total;

    currentIndex = newIndex === total - 1 ? 0 : newIndex;
  }
}

dialog.addEventListener('click', () => dialog.close());

document.addEventListener('keydown', (event) => {
  if (dialog.open) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      if (event.key === 'ArrowRight') updateCurrentIndex(true);
      if (event.key === 'ArrowLeft') updateCurrentIndex();

      openInViewer(currentIndex);
    }
  }
});

document.addEventListener('wheel', (event) => {
  if (dialog.open) {
    if (event.deltaY > 0) updateCurrentIndex(true);
    if (event.deltaY < 0) updateCurrentIndex();

    const file = mediaFiles[currentIndex];

    openInViewer(currentIndex);
  }
});

dialog.addEventListener('close', () => {
  dialog.innerHTML = '';
});

document.addEventListener('keydown', function (event) {
  if (dialog.open && event.code === 'Numpad5') {
    prompt('', mediaFiles[currentIndex].path);
  }
});
