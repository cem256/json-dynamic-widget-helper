import * as vscode from 'vscode';
import { showErrorMessage } from './ui-utils';

export function findJsonObjectAtSelection(document: vscode.TextDocument, selection: vscode.Selection) {
  const openingBracePosition = findOpeningBraceForParentObject(document, selection.start);
  if (!openingBracePosition) {
    showErrorMessage('Error: Could not find the opening brace for the JSON object.');
    return null;
  }

  const closingBracePosition = findClosingBrace(document, openingBracePosition);
  if (!closingBracePosition) {
    showErrorMessage('Error: Could not find the closing brace for the JSON object.');
    return null;
  }

  return parseJsonObject(document, openingBracePosition, closingBracePosition);
}

export function isValidSelection(document: vscode.TextDocument, selection: vscode.Selection): boolean {
  const lineText = document.lineAt(selection.start.line).text.trim();
  if (!lineText.startsWith('"type"')) {
    return false;
  }

  const colonIndex = lineText.indexOf(':');
  if (colonIndex === -1) {
    showErrorMessage('Error: Could not find the value for "type".');
    return false;
  }

  return true;
}

function parseJsonObject(document: vscode.TextDocument, start: vscode.Position, end: vscode.Position) {
  const jsonRange = new vscode.Range(start, end);
  const jsonText = document.getText(jsonRange);

  try {
    const parsedObject = JSON.parse(jsonText);
    return { object: parsedObject, start, end };
  } catch (e) {
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
