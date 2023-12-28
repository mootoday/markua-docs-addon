namespace ListItemConverter {
  export const convert = (listItem: GoogleAppsScript.Document.ListItem) => {
    const levelOfNesting = listItem.getNestingLevel();
    const listItemNestingPrefix = ' '.repeat(4).repeat(levelOfNesting);
    let listItemPrefix = '';

    switch (listItem.getGlyphType()) {
      case DocumentApp.GlyphType.BULLET:
      case DocumentApp.GlyphType.HOLLOW_BULLET:
      case DocumentApp.GlyphType.SQUARE_BULLET:
        listItemPrefix = '* ';
        break;
      default:
        listItemPrefix = '1. ';
    }

    return listItemNestingPrefix + listItemPrefix + listItem.getText() + '\n';
  }
}