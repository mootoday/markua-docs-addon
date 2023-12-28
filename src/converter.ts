namespace Converter {
  // const convertParagraph = () => ParagraphConverter.convert;

  const ELEMENT_CONVERTERS = {
    [DocumentApp.ElementType.LIST_ITEM]: (element) => ListItemConverter.convert(element),
    [DocumentApp.ElementType.PARAGRAPH]: (element) => ParagraphConverter.convert(element)
  };

  export const convert = () => {
    const numChildrenBody = DocumentApp.getActiveDocument().getBody().getNumChildren();
    let markuaOutput = '';

    for (let i = 0; i < numChildrenBody; i++) {
      const currentElement = DocumentApp.getActiveDocument().getBody().getChild(i);
      const elementProcessor = ELEMENT_CONVERTERS[currentElement.getType()];
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
