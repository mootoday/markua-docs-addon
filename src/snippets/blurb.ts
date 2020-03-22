namespace BlurbInserter {
  const BLURB_END = "\n{/blurb}\n";
  const PLACEHOLDER = "Enter your text here...";

  export const insert = (snippetInfo: SnippetInserter.SnippetInfo) => {
    const doc = DocumentApp.getActiveDocument();
    const cursor = doc.getCursor();
    if (!cursor) {
      DocumentApp.getUi().alert("Please place your cursor in the document.");
      return;
    }

    cursor.insertText(BLURB_END);
    const placeholder = cursor.insertText(PLACEHOLDER);
    if (snippetInfo.attributes && snippetInfo.attributes.clazz) {
      cursor.insertText(`{blurb, class: ${snippetInfo.attributes.clazz}}\n`);
    } else {
      cursor.insertText("{blurb}\n");
    }

    if (placeholder) {
      // Select the placeholder text for a better user experience
      const placeholderRange = doc.newRange();
      placeholderRange.addElement(placeholder);
      doc.setSelection(placeholderRange);
    }
  }
}