namespace SnippetInserter {
  enum SnippetType { ASIDE = "aside", BLURB = "blurb" };

  export interface SnippetInfo {
    type: SnippetType;
    attributes?: {
      clazz?: string;
    }
  }

  export const insertSnippet = (snippetInfo: SnippetInfo) => {
    switch (snippetInfo.type) {
      case SnippetType.ASIDE:
        AsideInserter.insert();
        break;
      case SnippetType.BLURB:
        BlurbInserter.insert(snippetInfo);
        break;
      default:
        Logger.log("Invalid snippet type: %s", snippetInfo.type);
        break;
    }

  }
}