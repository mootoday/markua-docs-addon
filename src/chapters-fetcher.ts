namespace ChaptersFetcher {
  interface ChapterInfo {
    name: string;
    url: string;
  }

  const getContentRootFolder = () => {
    try {
      const docId = DocumentApp.getActiveDocument().getId();
      Logger.log(docId);
      const file = DriveApp.getFileById(docId);
      Logger.log("A");
      const parentFolder = file.getParents().next();
      Logger.log("B");
      const grandParentFolder = parentFolder.getParents().next();
      Logger.log("C");
      return grandParentFolder;
    } catch (error) {
      Logger.log(error);
    }
  }

  /**
   * Validates that the current file is part of a pre-defined structure. This is important to properly
   * render a list of chapters in the correct order.
   */
  export const isEnvironmentValid = (): boolean => {
    const contentRootFolder = getContentRootFolder();

    // Validate folders and files
    let partFolders = contentRootFolder.getFolders();
    for (let partIndex = 0; partFolders.hasNext(); partIndex++) {
      const partFolder = partFolders.next();
      if (+partFolder.getName()[0] !== partIndex) return false;

      const partFiles = partFolder.getFiles();
      for (let fileIndex = 0; partFiles.hasNext(); fileIndex++) {
        if (+partFiles.next().getName()[0] !== fileIndex) return false;
      }
    }
    return true;
  }

  /**
   * Folder and file names are used to properly order a book that is split into a Google doc per chapter.
   *
   * The following structure is needed:
   *
   * 1 - Part One (folder)
   * ├── 1 - Title of the first chapter in part one (document)
   * ├── 2 - Title of the second chapter in part one (document)
   * 2 - Part Two (folder)
   * ├── 1 - Title of the first chapter in part two (document)
   * ├── 2 - Title of the second chapter in part two (document)
   * 3 - Part Three (same pattern applies as above)
   */
  export const fetchChapters = (): Array<ChapterInfo> => {
    return [{
      name: "Test chapter 1",
      url: "test-url-chapter-1"
    }, {
      name: "Test chapter 2",
      url: "test-url-chapter-2"
    }, {
      name: "Test chapter 3",
      url: "test-url-chapter-3"
    }]
  }
}