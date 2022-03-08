import * as vscode from 'vscode';
import { Context } from '../helpers/context';
import { UnrealEngineProject } from '../types';

/**
 * Active Project Status Bar Item
 */
export class ActiveProjectStatusBarItem {
    private _statusBarItem: vscode.StatusBarItem;
    private _project: vscode.WorkspaceFolder | undefined;

    constructor() {
        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        Context.events.onProjectChanged.on(this.update.bind(this));
    }

    // 
    public update(project: UnrealEngineProject) {
        this._statusBarItem.text = `${project.Modules[0].Name} (UE v${project.EngineAssociation})`;
        this._statusBarItem.show();
    }

    public hide(): void {
        this._project = undefined;
        this._statusBarItem.hide();
    }
}