import * as vscode from 'vscode';
import { registerCommands } from './commands/registerCommands';

export function activate(context: vscode.ExtensionContext) {
  registerCommands(context);
}

export function deactivate() {}
