import * as vscode from 'vscode';
import { registerCommands } from './commands/registerCommands';
import { JsonWidgetCodeActionProvider } from './providers/JsonWidgetCodeActionProvider';

export function activate(context: vscode.ExtensionContext) {
  registerCommands(context);

  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    { language: 'json', scheme: 'file' },
    new JsonWidgetCodeActionProvider(),
    {
      providedCodeActionKinds: JsonWidgetCodeActionProvider.providedCodeActionKinds
    }
  );

  context.subscriptions.push(codeActionProvider);
}

export function deactivate() {}
