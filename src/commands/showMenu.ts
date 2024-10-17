import * as vscode from 'vscode';
import { wrapWithWidget } from './wrapWithWidget';
import { removeWidget } from './removeWidget';
import { findJsonObjectAtSelection } from '../utils/jsonUtils';
import { showErrorMessage } from '../utils/uiUtils';

const WRAP_OPTIONS = ['Wrap with Column', 'Wrap with Row', 'Wrap with widget...'];
const REMOVE_OPTION = 'Remove this widget';

export async function showMenu() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection).trim();

  if (selectedText !== 'type') {
    showErrorMessage('Error: You must select the "type" key (without quotation marks).');
    return;
  }

  const jsonObject = findJsonObjectAtSelection(editor.document, selection);
  if (!jsonObject) {
    showErrorMessage('Error: Unable to find a valid JSON object.');
    return;
  }

  const options = [...WRAP_OPTIONS];
  const hasMultipleChildren = jsonObject.object.args && 
    Array.isArray(jsonObject.object.args.children) && 
    jsonObject.object.args.children.length > 1;

  if (!hasMultipleChildren) {
    options.push(REMOVE_OPTION);
  }

  const selectedAction = await vscode.window.showQuickPick(options, {
    placeHolder: 'Select an action to perform on the selected widget'
  });

  if (!selectedAction) return;

  await handleSelectedAction(selectedAction, editor);
}

async function handleSelectedAction(action: string, editor: vscode.TextEditor) {
  switch (action) {
    case 'Wrap with Column':
      wrapWithWidget(editor, 'column');
      break;
    case 'Wrap with Row':
      wrapWithWidget(editor, 'row');
      break;
    case 'Wrap with widget...':
      await handleCustomWrap(editor);
      break;
    case REMOVE_OPTION:
      removeWidget(editor);
      break;
  }
}

async function handleCustomWrap(editor: vscode.TextEditor) {
  const widgetType = await vscode.window.showInputBox({
    placeHolder: 'Enter the name of the widget to wrap with (e.g., Container, Padding)',
  });
  if (widgetType) {
    wrapWithWidget(editor, widgetType);
  } else {
    showErrorMessage('Error: You must enter a widget name.');
  }
}
