import * as vscode from 'vscode';
import { findJsonObjectAtSelection } from '../utils/jsonUtils';
import { createWrappedObject } from '../utils/widgetUtils';

export function wrapWithWidget(editor: vscode.TextEditor, wrapperType: string) {
  const document = editor.document;
  const selection = editor.selection;

  const jsonObject = findJsonObjectAtSelection(document, selection);

  if (!jsonObject) {
    vscode.window.showErrorMessage("Error: Unable to find a valid JSON object.");
    return;
  }

  const wrappedObject = createWrappedObject(wrapperType, jsonObject.object);

  editor.edit(editBuilder => {
    const range = new vscode.Range(jsonObject.start, jsonObject.end);
    editBuilder.replace(range, JSON.stringify(wrappedObject, null, 2));
  });
}
