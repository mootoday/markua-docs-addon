namespace TextConverter {
  const isCode = (textElement: GoogleAppsScript.Document.Text) => textElement.getFontFamily() === 'Roboto Mono';
  const convertCode = (textElement: GoogleAppsScript.Document.Text) => '```\n' + textElement.getText() + '\n```'

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
  const insertCharacter = (arrayOfCharacters: Array<string>, position: number, character: string, count: number = 1): number => {
    character.repeat(count).split("").forEach((character: string, index: number) => {
      arrayOfCharacters.splice(position + index, 0, character);
    });
    return count;
  }

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
      if (textElement.isBold(attributeIndex) &&
        textElement.isItalic(attributeIndex) &&
        textElement.isUnderline(attributeIndex)) {
          skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "_", 4);
      } else if (textElement.isBold(attributeIndex) &&
        textElement.isUnderline(attributeIndex)) {
          skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "_", 3);
      } else {
        if (textElement.isBold(attributeIndex)) {
          skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "*", 2);
        }
        if (textElement.isItalic(attributeIndex)) {
          skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "*");
        }
        if (textElement.isUnderline(attributeIndex)) {
          skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "_");
        }
        if (textElement.isStrikethrough(attributeIndex)) {
          skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "~", 2);
        }
      }


      // Closing formatting
      // In reverse order compared to the opening formatting to ensure proper
      // Markua syntax.
      if (index > 0) {
        if (textElement.isBold(attributeIndices[index - 1]) &&
          textElement.isItalic(attributeIndices[index - 1]) &&
          textElement.isUnderline(attributeIndices[index - 1])) {
            skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "_", 4);
        } else if (textElement.isBold(attributeIndices[index - 1]) &&
          textElement.isUnderline(attributeIndices[index - 1])) {
            skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "_", 3);
        } else {
          if (textElement.isStrikethrough(attributeIndices[index - 1])) {
            skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "~", 2);
          }
          if (textElement.isUnderline(attributeIndices[index - 1])) {
            skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "_");
          }
          if (textElement.isItalic(attributeIndices[index - 1])) {
            skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "*");
          }
          if (textElement.isBold(attributeIndices[index - 1])) {
            skipIndex += insertCharacter(formattedStringArray, attributeIndex + skipIndex, "*", 2);
          }
        }
      }
    });

    return formattedStringArray.join("");
  }

  const TEXT_CONVERTERS = [{
    test: isCode,
    convert: convertCode
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