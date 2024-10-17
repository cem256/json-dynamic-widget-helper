import * as vscode from 'vscode';
import { registerCommands } from './commands/commands';
import { JsonWidgetCodeActionProvider } from './providers/providers';

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
