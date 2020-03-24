namespace TextConverter {
  export const convert = (element: GoogleAppsScript.Document.Element) => {
    const textElement = element.asText();
    if (textElement.getFontFamily() === 'Roboto Mono') {
      return '```\n' + textElement.getText() + '\n```';
    }
    return textElement.getText();
  }
}