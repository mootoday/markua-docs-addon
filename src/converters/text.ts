namespace TextConverter {

  interface TextFormatterTester {
    (textElement: GoogleAppsScript.Document.Text, position: number): boolean;
  }

  interface TextFormatterInserter {
    // Find a more generic way to deal with link URLs. At the moment, they're the only exception to the rule.
    (arrayOfCharacters: string[], position: number, linkUrl?: string)
  }

  interface TextFormatterBase {
    test: TextFormatterTester;
    isExclusive?: boolean;
  }

  interface TextFormatterSimple extends TextFormatterBase {
    format: TextFormatterInserter;
  }

  interface TextFormatterAdvanced extends TextFormatterBase {
    formatOpening: TextFormatterInserter;
    formatClosing: TextFormatterInserter;
  }

  const isSimpleTextFormatter = (formatter: TextFormatterSimple | TextFormatterAdvanced): formatter is TextFormatterSimple => (formatter as TextFormatterSimple).format !== undefined;

  const isCodeBlock = (textElement: GoogleAppsScript.Document.Text) => textElement.getFontFamily() === 'Roboto Mono';
  const convertCodeBlock = (textElement: GoogleAppsScript.Document.Text) => '```\n' + textElement.getText() + '\n```'

  const isAbsoluteLinkBlock = (textElement: GoogleAppsScript.Document.Text) => textElement.getText() === textElement.getLinkUrl();
  const convertAbsoluteLinkBlock = (textElement: GoogleAppsScript.Document.Text) => `<${textElement.getLinkUrl()}>`;

  /**
   * Inserts a given character into an array of characters.
   *
   * @param arrayOfCharacters A string, represented as an array of characters.
   * @param position The start position at which to insert the character.
   * @param character The character to insert.
   * @param count How many times to insert the character.
   *
   * @returns The number of times the character was inserted.
   */
  const insertCharacter = (arrayOfCharacters: string[], position: number, character: string, count: number = 1): number => {
    character.repeat(count).split("").forEach((character: string, index: number) => {
      arrayOfCharacters.splice(position + index, 0, character);
    });
    return count;
  }

  const isLinkUrl: TextFormatterTester = (textElement, position) => !!textElement.getLinkUrl(position);
  const isAbsoluteLinkUrl: TextFormatterTester = (textElement, position) => textElement.getLinkUrl(position) && textElement.getText().substring(position, position + textElement.getLinkUrl(position).length) === textElement.getLinkUrl(position);
  const insertAbsoluteLinkUrlOpening: TextFormatterInserter = (arrayOfCharacters, position) => insertCharacter(arrayOfCharacters, position, "<");
  const insertAbsoluteLinkUrlClosing: TextFormatterInserter = (arrayOfCharacters, position) => insertCharacter(arrayOfCharacters, position, ">");
  
  // A link looks like [link text](absolute_url)
  const insertInlineLinkUrlOpening: TextFormatterInserter = (arrayOfCharacters, position) => insertCharacter(arrayOfCharacters, position, "[");
  const insertInlineLinkUrlClosing: TextFormatterInserter = (arrayOfCharacters, position, linkUrl) => {
    let insertCharactersCount = insertCharacter(arrayOfCharacters, position, "]");
    insertCharactersCount += insertCharacter(arrayOfCharacters, position + insertCharactersCount, "(");
    linkUrl.split("").forEach(character => {
      insertCharactersCount += insertCharacter(arrayOfCharacters, position + insertCharactersCount, character);
    });
    insertCharactersCount += insertCharacter(arrayOfCharacters, position + insertCharactersCount, ")");
    return insertCharactersCount;
  };

  const isBoldItalicUnderline: TextFormatterTester = (textElement, position) => textElement.isBold(position) &&
    textElement.isItalic(position) &&
    textElement.isUnderline(position);
  const insertBoldItalicUnderline: TextFormatterInserter = (arrayOfCharacters, position) => insertCharacter(arrayOfCharacters, position, "_", 4);

  const isBoldItalic: TextFormatterTester = (textElement, position) => textElement.isBold(position) &&
    textElement.isItalic(position);
  const insertBoldItalic: TextFormatterInserter = (arrayOfCharacters, position) => insertCharacter(arrayOfCharacters, position, "_", 3);

  const isBold: TextFormatterTester = (textElement, position) => textElement.isBold(position);
  const insertBold: TextFormatterInserter = (arrayOfCharacters, position) => insertCharacter(arrayOfCharacters, position, "*", 2);

  const isItalic: TextFormatterTester = (textElement, position) => textElement.isItalic(position);
  const insertItalic: TextFormatterInserter = (arrayOfCharacters, position) => insertCharacter(arrayOfCharacters, position, "*");

  const isUnderline: TextFormatterTester = (textElement, position) => textElement.isUnderline(position);
  const insertUnderline: TextFormatterInserter = (arrayOfCharacters, position) => insertCharacter(arrayOfCharacters, position, "_");

  const isStrikethrough: TextFormatterTester = (textElement, position) => textElement.isStrikethrough(position);
  const insertStrikethrough: TextFormatterInserter = (arrayOfCharacters, position) => insertCharacter(arrayOfCharacters, position, "~", 2);

  const TEXT_FORMATTERS: Array<TextFormatterSimple | TextFormatterAdvanced> = [{
    test: isBoldItalicUnderline,
    format: insertBoldItalicUnderline,
    isExclusive: true
  }, {
    test: isBoldItalic,
    format: insertBoldItalic,
    isExclusive: true
  }, {
    test: isBold,
    format: insertBold
  }, {
    test: isItalic,
    format: insertItalic
  }, {
    test: (textElement, position) => isUnderline(textElement, position) && !isLinkUrl(textElement, position),
    format: insertUnderline
  }, {
    test: isStrikethrough,
    format: insertStrikethrough
  }, {
    test: isAbsoluteLinkUrl,
    formatOpening: insertAbsoluteLinkUrlOpening,
    formatClosing: insertAbsoluteLinkUrlClosing
  }, {
    test: (textElement, position) => isLinkUrl(textElement, position) && !isAbsoluteLinkUrl(textElement, position),
    formatOpening: insertInlineLinkUrlOpening,
    formatClosing: insertInlineLinkUrlClosing
  }];

  /**
   * Converts a Text element, including its formatting such as bold and italic.
   *
   * @param textElement The Text element to convert.
   *
   * @see https://leanpub.com/markua/read#text-formatting
   */
  const convertTextWithFormatting = (textElement: GoogleAppsScript.Document.Text): string => {
    let formattedStringArray = textElement.getText().split("");
    let skipIndex = 0;

    const attributeIndices = textElement.getTextAttributeIndices();
    attributeIndices.forEach((attributeIndex, index) => {
      // Opening formatting
      const openingFormatters = TEXT_FORMATTERS.filter(formatter => formatter.test(textElement, attributeIndex));
      if (openingFormatters.some(formatter => formatter.isExclusive)) {
        const exclusiveOpeningFormatter = openingFormatters.find(formatter => formatter.isExclusive);
        if (isSimpleTextFormatter(exclusiveOpeningFormatter)) {
          skipIndex += exclusiveOpeningFormatter.format(formattedStringArray, attributeIndex + skipIndex);
        } else {
          skipIndex += exclusiveOpeningFormatter.formatOpening(formattedStringArray, attributeIndex + skipIndex);
        }
      } else {
        openingFormatters.forEach(formatter => {
          if (isSimpleTextFormatter(formatter)) {
            skipIndex += formatter.format(formattedStringArray, attributeIndex + skipIndex);
          } else {
            skipIndex += formatter.formatOpening(formattedStringArray, attributeIndex + skipIndex);
          }
        })
      }

      // Closing formatting
      if (index > 0) {
        // In reverse order compared to the opening formatting to ensure proper Markua syntax.
        const closingFormatters = TEXT_FORMATTERS.slice().reverse().filter(formatter => formatter.test(textElement, attributeIndices[index - 1]));
        if (closingFormatters.some(formatter => formatter.isExclusive)) {
          const exclusiveClosingFormatter = closingFormatters.find(formatter => formatter.isExclusive);
          if (isSimpleTextFormatter(exclusiveClosingFormatter)) {
            skipIndex += exclusiveClosingFormatter.format(formattedStringArray, attributeIndex + skipIndex);
          } else {
            skipIndex += exclusiveClosingFormatter.formatClosing(formattedStringArray, attributeIndex + skipIndex);
          }
        } else {
          closingFormatters.forEach(formatter => {
            if (isSimpleTextFormatter(formatter)) {
              skipIndex += formatter.format(formattedStringArray, attributeIndex + skipIndex);
            } else {
              skipIndex += formatter.formatClosing(formattedStringArray, attributeIndex + skipIndex, textElement.getLinkUrl(attributeIndices[index - 1]));
            }
          })
        }
      }
    });

    // If a Text element contains formatting on the last character, we need to deal with that.
    // E.g. "A text with the last word **bold**"
    // The final two asterisks in this case need to be added to adhere to the Markua spec.
    const lastCharacterIndex = textElement.getText().length;
    const closingFormatters = TEXT_FORMATTERS.slice().reverse().filter(formatter => formatter.test(textElement, lastCharacterIndex - 1));
    if (closingFormatters.some(formatter => formatter.isExclusive)) {
      const exclusiveClosingFormatter = closingFormatters.find(formatter => formatter.isExclusive);
      if (isSimpleTextFormatter(exclusiveClosingFormatter)) {
        skipIndex += exclusiveClosingFormatter.format(formattedStringArray, lastCharacterIndex + skipIndex);
      } else {
        skipIndex += exclusiveClosingFormatter.formatClosing(formattedStringArray, lastCharacterIndex + skipIndex);
      }
    } else {
      closingFormatters.forEach(formatter => {
        if (isSimpleTextFormatter(formatter)) {
          skipIndex += formatter.format(formattedStringArray, lastCharacterIndex + skipIndex);
        } else {
          skipIndex += formatter.formatClosing(formattedStringArray, lastCharacterIndex + skipIndex, textElement.getLinkUrl(lastCharacterIndex - 1));
        }
      })
    }
    return formattedStringArray.join("");
  }

  const TEXT_CONVERTERS = [{
    test: isCodeBlock,
    convert: convertCodeBlock
  }, {
    test: isAbsoluteLinkBlock,
    convert: convertAbsoluteLinkBlock
  }, {
    // Catch all (keep at the end of this array)
    test: () => true,
    convert: convertTextWithFormatting
  }];

  export const convert = (textElement: GoogleAppsScript.Document.Text) => {
    const converter = TEXT_CONVERTERS.find((textConverter) => textConverter.test(textElement));
    return converter.convert(textElement);
  }
}