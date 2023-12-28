namespace Converter {
  const processText = (element: GoogleAppsScript.Document.Element) => {
    const textElement = element.asText();
    if (textElement.getFontFamily() === 'Roboto Mono') {
      return '```\n' + textElement.getText() + '\n```';
    }
    return textElement.getText();
  }

  const PARAGRAPH_CHILD_PROCESSORS = {
    [DocumentApp.ElementType.TEXT]: processText
  };

  const getParagraphHeadingPrefix = (element: GoogleAppsScript.Document.Element) => {
    const paragraph = element.asParagraph();
    let headingPrefix = '';

    switch (paragraph.getHeading()) {
      case DocumentApp.ParagraphHeading.TITLE:
        headingPrefix += "# ";
        break;
      case DocumentApp.ParagraphHeading.HEADING6: headingPrefix += "#";
      case DocumentApp.ParagraphHeading.HEADING5: headingPrefix += "#";
      case DocumentApp.ParagraphHeading.HEADING4: headingPrefix += "#";
      case DocumentApp.ParagraphHeading.HEADING3: headingPrefix += "#";
      case DocumentApp.ParagraphHeading.HEADING2: headingPrefix += "#";
      case DocumentApp.ParagraphHeading.HEADING1: headingPrefix += "# ";
      default:
    }

    if (paragraph.getHeading() === DocumentApp.ParagraphHeading.TITLE) {
    }

    return headingPrefix;
  }

  const getParagraphHeadingSuffix = (element: GoogleAppsScript.Document.Element) => element.asParagraph().getHeading() === DocumentApp.ParagraphHeading.TITLE ? " #" : "";

  const processListItem = (element: GoogleAppsScript.Document.Element) => {
    const listItem = element.asListItem();
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

  const processParagraph = (element: GoogleAppsScript.Document.Element) => {
    const paragraph = element.asParagraph();
    if (paragraph.getNumChildren() === 0) {
      return '';
    }
    let paragraphOutput = getParagraphHeadingPrefix(paragraph);

    for (let i = 0; i < paragraph.getNumChildren(); i++) {
      const currentParagraphElement = paragraph.getChild(i);
      Logger.log("Processing paragraph element of type %s", currentParagraphElement.getType());

      const paragraphChildProcessor = PARAGRAPH_CHILD_PROCESSORS[currentParagraphElement.getType()];
      if (paragraphChildProcessor) {
        paragraphOutput += paragraphChildProcessor(currentParagraphElement);
      } else {
        Logger.log("TODO: Implement paragraph child processor for type: %s", currentParagraphElement.getType());
      }
    }

    paragraphOutput += getParagraphHeadingSuffix(paragraph);
    paragraphOutput += '\n\n';
    return paragraphOutput;
  }

  const ELEMENT_PROCESSORS = {
    [DocumentApp.ElementType.LIST_ITEM]: processListItem,
    [DocumentApp.ElementType.PARAGRAPH]: processParagraph
  };


  export const convert = () => {
    const numChildrenBody = DocumentApp.getActiveDocument().getBody().getNumChildren();
    let markuaOutput = '';

    for (let i = 0; i < numChildrenBody; i++) {
      const currentElement = DocumentApp.getActiveDocument().getBody().getChild(i);
      const elementProcessor = ELEMENT_PROCESSORS[currentElement.getType()];
      if (elementProcessor) {

        // The LIST_ITEM processor appends a single '\n' at the end of each item.
        // At the end of a list we need to add an additional new line
        if (i >= 1 &&
          DocumentApp.getActiveDocument().getBody().getChild(i - 1).getType() === DocumentApp.ElementType.LIST_ITEM &&
          DocumentApp.getActiveDocument().getBody().getChild(i).getType() !== DocumentApp.ElementType.LIST_ITEM
        ) {
          markuaOutput += '\n';
        }

        markuaOutput += elementProcessor(currentElement);
      } else {
        Logger.log("TODO: Implement processor for type: %s", currentElement.getType());
      }
    }
    return markuaOutput;
  }
}
