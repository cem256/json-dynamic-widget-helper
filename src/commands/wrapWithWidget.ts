import * as vscode from 'vscode';
import { findJsonObjectAtSelection } from '../utils/jsonUtils';

export function wrapWithWidget(editor: vscode.TextEditor, wrapperType: string) {
  const document = editor.document;
  const selection = editor.selection;

  const jsonObject = findJsonObjectAtSelection(document, selection);

  if (jsonObject) {
    let wrappedObject;

    if (wrapperType === 'row' || wrapperType === 'column') {
      wrappedObject = {
        type: wrapperType,
        args: {
          children: [jsonObject.object]
        }
      };
    } else {
      wrappedObject = {
        type: wrapperType,
        args: {
          child: jsonObject.object
        }
      };
    }

    editor.edit(editBuilder => {
      const range = new vscode.Range(jsonObject.start, jsonObject.end);
      editBuilder.replace(range, JSON.stringify(wrappedObject, null, 2));
    });
  } else {
    vscode.window.showErrorMessage("Error: Unable to find a valid JSON object.");
  }
}
