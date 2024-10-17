import * as vscode from 'vscode';

export class JsonWidgetCodeActionProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.Refactor
  ];

  public provideCodeActions(): vscode.CodeAction[] | undefined {

    const actions: vscode.CodeAction[] = [];

    // Add wrap actions
    const wrapActions = ['Column', 'Row', 'Container', 'Center'].map(widgetType => {
      const action = new vscode.CodeAction(`Wrap with ${widgetType}`, vscode.CodeActionKind.Refactor);
      action.command = {
        command: 'json-dynamic-widget-helper.wrapWithWidget',
        title: `Wrap with ${widgetType}`,
        arguments: [widgetType.toLowerCase()]
      };
      return action;
    });
    actions.push(...wrapActions);

    // Add remove action
    const removeAction = new vscode.CodeAction('Remove this widget', vscode.CodeActionKind.Refactor);
    removeAction.command = {
      command: 'json-dynamic-widget-helper.removeWidget',
      title: 'Remove this widget'
    };
    actions.push(removeAction);

    return actions;
  }
}
