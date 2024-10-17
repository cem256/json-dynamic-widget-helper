import * as vscode from 'vscode';
import { showErrorMessage } from './uiUtils';

export function findJsonObjectAtSelection(document: vscode.TextDocument, selection: vscode.Selection) {
  const startPosition = selection.start;
  const endPosition = selection.end;

  const selectedText = document.getText(new vscode.Range(startPosition, endPosition)).trim();

  if (selectedText !== 'type') {
    showErrorMessage('Error: Selection must be the word "type" without quotation marks.');
    return null;
  }

  const lineText = document.lineAt(startPosition.line).text;
  const colonIndex = lineText.indexOf(':', startPosition.character);

  if (colonIndex === -1) {
    showErrorMessage('Error: Could not find the value for "type".');
    return null;
  }

  const openingBracePosition = findOpeningBraceForParentObject(document, startPosition);

  if (!openingBracePosition) {
    showErrorMessage('Error: Could not find the opening brace for the JSON object.');
    return null;
  }

  const closingBracePosition = findClosingBrace(document, openingBracePosition);

  if (!closingBracePosition) {
    showErrorMessage('Error: Could not find the closing brace for the JSON object.');
    return null;
  }

  const jsonRange = new vscode.Range(openingBracePosition, closingBracePosition);
  const jsonText = document.getText(jsonRange);

  try {
    const parsedObject = JSON.parse(jsonText);
    return { object: parsedObject, start: openingBracePosition, end: closingBracePosition };
  } catch (e) {
    showErrorMessage('Error: Invalid JSON object.');
    return null;
  }
}

function findOpeningBraceForParentObject(document: vscode.TextDocument, startPosition: vscode.Position) {
  let position = startPosition;

  while (position.line >= 0) {
    const lineText = document.lineAt(position.line).text;

    for (let i = position.character; i >= 0; i--) {
      if (lineText[i] === '{') {
        return new vscode.Position(position.line, i);
      }
    }

    position = new vscode.Position(position.line - 1, document.lineAt(position.line - 1).text.length);
  }

  return null;
}

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
        return new vscode.Position(position.line, i + 1);
      }
    }

    position = position.translate(1, 0);
    position = new vscode.Position(position.line, 0);
  }

  return null;
}
