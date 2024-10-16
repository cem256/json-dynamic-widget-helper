import * as vscode from 'vscode';
import { findJsonObjectAtSelection } from '../utils/jsonUtils';

export function removeChild(editor: vscode.TextEditor) {
  const document = editor.document;
  const selection = editor.selection;

  const jsonObject = findJsonObjectAtSelection(document, selection);

  if (jsonObject) {
    editor.edit(editBuilder => {
      const range = new vscode.Range(jsonObject.start, jsonObject.end);
      editBuilder.replace(range, '');
    });
  } else {
    vscode.window.showErrorMessage("Error: Unable to find a valid JSON object.");
  }
}
