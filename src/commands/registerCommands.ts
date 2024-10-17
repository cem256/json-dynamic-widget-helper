import * as vscode from 'vscode';
import { wrapWithWidget } from './wrapWithWidget';
import { removeWidget } from './removeWidget';

export function registerCommands(context: vscode.ExtensionContext) {

  const wrapWithWidgetCommand = vscode.commands.registerCommand(
    'json-dynamic-widget-helper.wrapWithWidget',
    (widgetType: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        wrapWithWidget(editor, widgetType);
      }
    }
  );

  const removeWidgetCommand = vscode.commands.registerCommand(
    'json-dynamic-widget-helper.removeWidget',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        removeWidget(editor);
      }
    }
  );

  context.subscriptions.push( wrapWithWidgetCommand, removeWidgetCommand);
}
