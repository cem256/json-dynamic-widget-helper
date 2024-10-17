import * as vscode from 'vscode';
import { findJsonObjectAtSelection } from '../utils/jsonUtils';

export function removeWidget(editor: vscode.TextEditor) {
  const document = editor.document;
  const selection = editor.selection;

  const jsonObject = findJsonObjectAtSelection(document, selection);

  if (jsonObject) {
    editor.edit(editBuilder => {
      const range = new vscode.Range(jsonObject.start, jsonObject.end);
      
      // Check if the widget has exactly one child
      const hasOneChild = jsonObject.object.args && 
        ((jsonObject.object.args.child && Object.keys(jsonObject.object.args).length === 1) ||
         (Array.isArray(jsonObject.object.args.children) && jsonObject.object.args.children.length === 1));

      if (hasOneChild) {
        // If it has exactly one child, replace the widget with its child
        const childContent = JSON.stringify(
          jsonObject.object.args.child || jsonObject.object.args.children[0],
          null,
          2
        );
        editBuilder.replace(range, childContent);
      } else {
        // If there's no child or multiple children, remove the widget
        editBuilder.delete(range);
      }
    });
  } else {
    vscode.window.showErrorMessage("Error: Unable to find a valid JSON object.");
  }
}
