import * as vscode from 'vscode';
import { findJsonObjectAtSelection } from '../utils/jsonUtils';

export function removeWidget(editor: vscode.TextEditor) {
  const document = editor.document;
  const selection = editor.selection;

  const jsonObject = findJsonObjectAtSelection(document, selection);

  if (jsonObject) {
    editor.edit(editBuilder => {
      const range = new vscode.Range(jsonObject.start, jsonObject.end);
      if (jsonObject.object.args && jsonObject.object.args.child) {
        const childContent = JSON.stringify(jsonObject.object.args.child, null, 2);
        editBuilder.replace(range, childContent);
      } else {
        editBuilder.replace(range, '');
      }
    });
  } else {
    vscode.window.showErrorMessage("Error: Unable to find a valid JSON object.");
  }
}
