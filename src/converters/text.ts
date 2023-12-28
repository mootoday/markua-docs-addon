namespace TextConverter {
  const isCode = (textElement: GoogleAppsScript.Document.Text) => textElement.getFontFamily() === 'Roboto Mono';
  const convertCode = (textElement: GoogleAppsScript.Document.Text) => '```\n' + textElement.getText() + '\n```'

  const TEXT_CONVERTERS = [{
    test: isCode,
    convert: convertCode
  }, {
    test: () => true,
    convert: (textElement: GoogleAppsScript.Document.Text) => textElement.getText()
  }];
  export const convert = (textElement: GoogleAppsScript.Document.Text) => {
    const converter = TEXT_CONVERTERS.find((textConverter) => textConverter.test(textElement));
    return converter.convert(textElement);
  }
}