import * as vscode from 'vscode';
import { findJsonObjectAtSelection } from '../utils/jsonUtils';
import { hasOneChild, getChildContent } from '../utils/widgetUtils';

export function removeWidget(editor: vscode.TextEditor) {
  const document = editor.document;
  const selection = editor.selection;

  const jsonObject = findJsonObjectAtSelection(document, selection);

  if (!jsonObject) {
    vscode.window.showErrorMessage("Error: Unable to find a valid JSON object.");
    return;
  }

  editor.edit(editBuilder => {
    const range = new vscode.Range(jsonObject.start, jsonObject.end);
    
    if (hasOneChild(jsonObject.object)) {
      // If it has exactly one child, replace the widget with its child
      editBuilder.replace(range, getChildContent(jsonObject.object));
    } else {
      // If there's no child or multiple children, remove the widget
      editBuilder.delete(range);
    }
  });
}
