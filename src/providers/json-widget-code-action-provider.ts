import * as vscode from 'vscode';
import { findJsonObjectAtSelection, hasOneOrNoChild, isValidSelection } from '../utils/utils';

const WRAP_WIDGET_TYPES = ['Center','Container', 'Column', 'Row'];
const COMMAND_PREFIX = 'json-dynamic-widget-helper';

export class JsonWidgetCodeActionProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.Refactor
  ];

  public provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection): vscode.CodeAction[] {
    const line = document.lineAt(range.start.line);
    const lineRange = line.range;

    if (!isValidSelection(document, new vscode.Selection(lineRange.start, lineRange.end))) {
      return [];
    }

    const actions: vscode.CodeAction[] = [];

    // Add custom wrap action
    actions.push(this.createCustomWrapAction());

    // Add wrap actions
    actions.push(...this.createWrapActions());

    // Add remove action only if the widget has exactly one child or no child
    const jsonObject = findJsonObjectAtSelection(document, new vscode.Selection(lineRange.start, lineRange.end));
    if (jsonObject && hasOneOrNoChild(jsonObject.object)) {
      actions.push(this.createRemoveAction());
    }

    return actions;
  }

  private createWrapActions(): vscode.CodeAction[] {
    return WRAP_WIDGET_TYPES.map(widgetType => {
      const action = new vscode.CodeAction(`Wrap with ${widgetType}`, vscode.CodeActionKind.Refactor);
      action.command = {
        command: `${COMMAND_PREFIX}.wrapWithWidget`,
        title: `Wrap with ${widgetType}`,
        arguments: [widgetType.toLowerCase()]
      };
      return action;
    });
  }

  private createCustomWrapAction(): vscode.CodeAction {
    const action = new vscode.CodeAction('Wrap with widget...', vscode.CodeActionKind.Refactor);
    action.command = {
      command: `${COMMAND_PREFIX}.wrapWithCustomWidget`,
      title: 'Wrap with widget...'
    };
    return action;
  }

  private createRemoveAction(): vscode.CodeAction {
    const removeAction = new vscode.CodeAction('Remove this widget', vscode.CodeActionKind.Refactor);
    removeAction.command = {
      command: `${COMMAND_PREFIX}.removeWidget`,
      title: 'Remove this widget'
    };
    return removeAction;
  }
}
