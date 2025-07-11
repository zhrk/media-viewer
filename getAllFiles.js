async function* getAllFiles(dirHandle, path = dirHandle.name) {
  for await (const [name, handle] of dirHandle.entries()) {
    const fullPath = path + '/' + name;

    if (handle.kind === 'directory') {
      const excludedFolders = [];

      if (!excludedFolders.includes(name)) {
        yield* getAllFiles(handle, fullPath);
      }
    }

    if (handle.kind === 'file') {
      yield { handle, path: fullPath };
    }
  }
}
