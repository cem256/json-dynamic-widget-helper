import * as vscode from 'vscode';
import { showMenu } from './showMenu';

export function registerCommands(context: vscode.ExtensionContext) {
  const showMenuCommand = vscode.commands.registerCommand(
    'json-dynamic-widget-helper.showMenu',
    showMenu
  );

  context.subscriptions.push(showMenuCommand);
}
