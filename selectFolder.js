const select = document.getElementById('select');
const meta = document.getElementById('meta');
const grid = document.getElementById('grid');
const counter = document.getElementById('counter');
const shuffle = document.getElementById('shuffle');

const mediaFiles = [];

async function selectFolder() {
  const dirHandle = await window.showDirectoryPicker({ startIn: 'desktop' });
  const handles = [];

  for await (const { handle, path } of getAllFiles(dirHandle)) {
    const file = await handle.getFile();

    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      handles.push({ handle, path, modified: file.lastModified });
    }
  }

  if (shuffle.checked) {
    shuffleArray(handles);
  } else {
    handles.sort((a, b) => b.modified - a.modified);
  }

  const total = handles.length;
  let loaded = 0;
  counter.textContent = `0 / ${total}`;

  const updateCounter = () => {
    loaded++;
    counter.textContent = `${loaded} / ${total}`;
  };

  for (const { handle, path } of handles) {
    const file = await handle.getFile();
    const url = URL.createObjectURL(file);

    mediaFiles.push({ url, type: file.type, path, handle });

    const index = mediaFiles.length - 1;

    if (file.type.startsWith('image/')) {
      const element = document.createElement('img');

      element.src = url;
      element.onclick = () => openInViewer(index);
      element.onload = updateCounter;

      grid.appendChild(element);
    } else if (file.type.startsWith('video/')) {
      const element = document.createElement('video');

      updateCounter();

      element.src = url;
      element.muted = true;
      element.loop = true;
      element.onclick = () => openInViewer(index);
      observer.observe(element);

      grid.appendChild(element);
    }
  }
}
