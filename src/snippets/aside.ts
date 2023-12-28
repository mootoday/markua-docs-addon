namespace AsideInserter {
  const ASIDE_BEGIN = "{aside}\n";
  const ASIDE_END = "\n{/aside}\n";
  const PLACEHOLDER = "Enter your text here...";

  export const insert = () => {
    const doc = DocumentApp.getActiveDocument();
    const cursor = doc.getCursor();
    if (!cursor) {
      DocumentApp.getUi().alert("Please place your cursor in the document.");
      return;
    }

    cursor.insertText(ASIDE_END);
    const placeholder = cursor.insertText(PLACEHOLDER);
    cursor.insertText(ASIDE_BEGIN);

    if (placeholder) {
      // Select the placeholder text for a better user experience
      const placeholderRange = doc.newRange();
      placeholderRange.addElement(placeholder);
      doc.setSelection(placeholderRange);
    }
  }
}