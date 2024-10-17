import * as vscode from 'vscode';
import { wrapWithWidget } from './wrapWithWidget';
import { removeWidget } from './removeWidget';
import { findJsonObjectAtSelection } from '../utils/jsonUtils';

export async function showMenu() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection).trim();

  if (selectedText !== 'type') {
    vscode.window.showErrorMessage('Error: You must select the "type" key (without quotation marks).');
    return;
  }

  const jsonObject = findJsonObjectAtSelection(editor.document, selection);

  if (!jsonObject) {
    vscode.window.showErrorMessage('Error: Unable to find a valid JSON object.');
    return;
  }

  const options = ['Wrap with widget...', 'Wrap with Column', 'Wrap with Row'];

  // Check if the widget has multiple children
  const hasMultipleChildren = jsonObject.object.args && 
    Array.isArray(jsonObject.object.args.children) && 
    jsonObject.object.args.children.length > 1;

  // Add 'Remove this widget' option only if it doesn't have multiple children
  if (!hasMultipleChildren) {
    options.push('Remove this widget');
  }

  const selectedAction = await vscode.window.showQuickPick(options, {
    placeHolder: 'Select an action to perform on the selected widget'
  });

  if (!selectedAction) {
    return;
  }

  switch (selectedAction) {
    case 'Wrap with Column':
      wrapWithWidget(editor, 'column');
      break;
    case 'Wrap with Row':
      wrapWithWidget(editor, 'row');
      break;
    case 'Wrap with widget...':
      const widgetType = await vscode.window.showInputBox({
        placeHolder: 'Enter the name of the widget to wrap with (e.g., Container, Padding)',
      });
      if (widgetType) {
        wrapWithWidget(editor, widgetType);
      } else {
        vscode.window.showErrorMessage('Error: You must enter a widget name.');
      }
      break;
    case 'Remove this widget':
      removeWidget(editor);
      break;
  }
}
