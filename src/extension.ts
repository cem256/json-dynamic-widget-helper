import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    
  // Register the main command to show a menu
  const showMenu = vscode.commands.registerCommand(
    'json-dynamic-widget-helper.showMenu',
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection).trim();

        // Check if the selected text is "type"
        if (selectedText !== 'type') {
          vscode.window.showErrorMessage('Error: You must select the "type" key (without quotation marks).');
          return; // Exit if the selection is not "type"
        }

        // Display a menu with QuickPick for the user to select an action
        const options = ['Wrap with widget...','Wrap with Column', 'Wrap with Row', 'Remove this widget'];
        const selectedAction = await vscode.window.showQuickPick(options, {
          placeHolder: 'Select an action to perform on the selected widget'
        });

        if (!selectedAction) {
          return; // No action selected
        }

        // Call appropriate function based on the selected action
        if (selectedAction === 'Wrap with Column') {
          wrapWithWidget(editor, 'column');
        } else if (selectedAction === 'Wrap with Row') {
          wrapWithWidget(editor, 'row');
        } else if (selectedAction === 'Wrap with widget...') {
          const widgetType = await vscode.window.showInputBox({
            placeHolder: 'Enter the name of the widget to wrap with (e.g., Container, Padding)',
          });

          if (widgetType) {
            wrapWithWidget(editor, widgetType);
          } else {
            vscode.window.showErrorMessage('Error: You must enter a widget name.');
          }
        } else if (selectedAction === 'Remove this widget') {
          removeChild(editor);
        }
      }
    }
  );

  context.subscriptions.push(showMenu);
}

// Function to wrap selected widget with a specified parent widget (e.g., row, column, or custom widget)
function wrapWithWidget(editor: vscode.TextEditor, wrapperType: string) {
  const document = editor.document;
  const selection = editor.selection;

  // Find the entire JSON object based on the selected "type" key
  const jsonObject = findJsonObjectAtSelection(document, selection);

  if (jsonObject) {
    // Construct the wrapper JSON structure
    const wrappedObject = {
      type: wrapperType,
      args: {
        child: jsonObject.object
      }
    };

    // Replace the selected JSON with the new wrapped structure
    editor.edit(editBuilder => {
      const range = new vscode.Range(jsonObject.start, jsonObject.end);
      editBuilder.replace(range, JSON.stringify(wrappedObject, null, 2));
    });
  } else {
    vscode.window.showErrorMessage("Error: Unable to find a valid JSON object.");
  }
}

// Function to remove a selected child (i.e., delete the selected text)
function removeChild(editor: vscode.TextEditor) {
  const document = editor.document;
  const selection = editor.selection;

  // Find the entire JSON object based on the selected "type" key
  const jsonObject = findJsonObjectAtSelection(document, selection);

  if (jsonObject) {
    // Remove the selected JSON object
    editor.edit(editBuilder => {
      const range = new vscode.Range(jsonObject.start, jsonObject.end);
      editBuilder.replace(range, ''); // Remove the content
    });
  } else {
    vscode.window.showErrorMessage("Error: Unable to find a valid JSON object.");
  }
}

// Function to find the full JSON object based on the selected "type" key (without quotation marks)
function findJsonObjectAtSelection(document: vscode.TextDocument, selection: vscode.Selection) {
  const startPosition = selection.start;
  const endPosition = selection.end;

  const selectedText = document.getText(new vscode.Range(startPosition, endPosition)).trim();

  // Make sure the user selected the "type" key (without quotes)
  if (selectedText !== 'type') {
    vscode.window.showErrorMessage('Error: Selection must be the word "type" without quotation marks.');
    return null;
  }

  // Now search for the opening brace of the object that contains this "type" key
  const lineText = document.lineAt(startPosition.line).text;
  const colonIndex = lineText.indexOf(':', startPosition.character);

  if (colonIndex === -1) {
    vscode.window.showErrorMessage('Error: Could not find the value for "type".');
    return null;
  }

  // Start searching for the opening brace that corresponds to the object containing "type"
  const openingBracePosition = findOpeningBraceForParentObject(document, startPosition);

  if (!openingBracePosition) {
    vscode.window.showErrorMessage('Error: Could not find the opening brace for the JSON object.');
    return null;
  }

  // Find the matching closing brace
  const closingBracePosition = findClosingBrace(document, openingBracePosition);

  if (!closingBracePosition) {
    vscode.window.showErrorMessage('Error: Could not find the closing brace for the JSON object.');
    return null;
  }

  const jsonRange = new vscode.Range(openingBracePosition, closingBracePosition);
  const jsonText = document.getText(jsonRange);

  try {
    // Parse the JSON object between the braces
    const parsedObject = JSON.parse(jsonText);
    return { object: parsedObject, start: openingBracePosition, end: closingBracePosition };
  } catch (e) {
    vscode.window.showErrorMessage('Error: Invalid JSON object.');
    return null;
  }
}

// Function to find the opening brace for the parent object containing the "type" key
function findOpeningBraceForParentObject(document: vscode.TextDocument, startPosition: vscode.Position) {
  let position = startPosition;

  while (position.line >= 0) {
    const lineText = document.lineAt(position.line).text;

    for (let i = position.character; i >= 0; i--) {
      const char = lineText[i];

      if (char === '{') {
        return new vscode.Position(position.line, i); // Found the opening brace
      }
    }

    // Move to the previous line and start from the end of that line
    position = new vscode.Position(position.line - 1, document.lineAt(position.line - 1).text.length);
  }

  return null; // Return null if no opening brace is found
}

// Function to find the matching closing brace for a given opening brace
function findClosingBrace(document: vscode.TextDocument, startPosition: vscode.Position) {
  let openBraces = 0;
  let position = startPosition;

  while (position.line < document.lineCount) {
    const lineText = document.lineAt(position.line).text;

    for (let i = position.character; i < lineText.length; i++) {
      const char = lineText[i];

      if (char === '{') {
        openBraces++;
      } else if (char === '}') {
        openBraces--;
      }

      if (openBraces === 0) {
        return new vscode.Position(position.line, i + 1); // Return the position just after the closing brace
      }
    }

    position = position.translate(1, 0); // Move to the next line
    position = new vscode.Position(position.line, 0); // Start from the first character in the new line
  }

  return null; // Return null if no matching closing brace is found
}

// This method is called when your extension is deactivated
export function deactivate() {}
