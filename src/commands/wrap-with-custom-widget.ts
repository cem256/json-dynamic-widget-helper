import * as vscode from 'vscode';
import { createWrappedObject, showErrorMessage, findJsonObjectAtSelection } from '../utils/utils';

export async function wrapWithCustomWidget(editor: vscode.TextEditor) {
  const { document, selection } = editor;
  const jsonObject = findJsonObjectAtSelection(document, selection);

  if (!jsonObject) {
    showErrorMessage("Error: Unable to find a valid JSON object.");
    return;
  }

  const widgetName = await vscode.window.showInputBox({
    prompt: "Enter the name of the widget",
    placeHolder: "e.g., CustomContainer"
  });

  if (!widgetName) {
    return; // User cancelled the input
  }

  const wrappedObject = createWrappedObject(widgetName.toLowerCase(), jsonObject.object);
  const wrappedJson = JSON.stringify(wrappedObject, null, 2);

  editor.edit(editBuilder => {
    const range = new vscode.Range(jsonObject.start, jsonObject.end);
    editBuilder.replace(range, wrappedJson);
  });
}
