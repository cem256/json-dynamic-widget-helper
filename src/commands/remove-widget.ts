import * as vscode from 'vscode';
import { hasOneChild, getChildContent, showErrorMessage, findJsonObjectAtSelection } from '../utils/utils';

export function removeWidget(editor: vscode.TextEditor) {
  const { document, selection } = editor;
  const jsonObject = findJsonObjectAtSelection(document, selection);

  if (!jsonObject) {
    showErrorMessage("Error: Unable to find a valid JSON object.");
    return;
  }

  editor.edit(editBuilder => {
    const range = new vscode.Range(jsonObject.start, jsonObject.end);
    const newContent = hasOneChild(jsonObject.object)
      ? getChildContent(jsonObject.object)
      : '';
    editBuilder.replace(range, newContent);
  });
}
