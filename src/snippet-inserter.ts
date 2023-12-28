namespace SnippetInserter {
  enum SnippetType { ASIDE = "aside" };

  export interface SnippetInfo {
    type: SnippetType;
  }

  export const insertSnippet = (snippetInfo: SnippetInfo) => {
    switch (snippetInfo.type) {
      case SnippetType.ASIDE:
        AsideInserter.insert();
        break;
      default:
        Logger.log("Invalid snippet type: %s", snippetInfo.type);
        break;
    }

  }
}