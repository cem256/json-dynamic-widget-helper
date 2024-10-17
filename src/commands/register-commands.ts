import * as vscode from 'vscode';
import { removeWidget, wrapWithWidget, wrapWithCustomWidget } from './commands';

function registerEditorCommand(context: vscode.ExtensionContext, commandId: string, callback: (editor: vscode.TextEditor, ...args: any[]) => void) {
  const command = vscode.commands.registerTextEditorCommand(commandId, callback);
  context.subscriptions.push(command);
}

export function registerCommands(context: vscode.ExtensionContext) {
  registerEditorCommand(context, 'json-dynamic-widget-helper.wrapWithWidget', (editor, _, widgetType: string) => {
    wrapWithWidget(editor, widgetType);
  });

  registerEditorCommand(context, 'json-dynamic-widget-helper.wrapWithCustomWidget', (editor) => {
    wrapWithCustomWidget(editor);
  });

  registerEditorCommand(context, 'json-dynamic-widget-helper.removeWidget', (editor) => {
    removeWidget(editor);
  });
}
