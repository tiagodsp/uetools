// Warning: VsCode side script file only!
import * as vscode from 'vscode';
import { Context } from '../../../helpers/context';
import * as path from 'path';

/**
 * Project View Controller for VSCode
 */
export class ModulesViewController {
    private _webviewView: vscode.WebviewView | undefined;
    private _extensionContext: vscode.ExtensionContext;
    private _bundleName: string = 'uetools-modules';
    private _updateInterval: number = 1000;

    /**
     * @param context Extension context
     */
    constructor(context: vscode.ExtensionContext) {
        this._extensionContext = context;
        vscode.window.registerWebviewViewProvider('uetools.modules', {
            resolveWebviewView: (webviewView, _webviewView) => {
                this._webviewView = webviewView;
                this.createOrShowPanel();
            }
        });
    }

    /**
     * Create or show the webview
     */
    private createOrShowPanel() {
        if (this._webviewView) {
            this._webviewView.webview.options = {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(this._extensionContext.extensionPath, 'dist')),
                    vscode.Uri.file(path.join(this._extensionContext.extensionPath, 'res')),
                    vscode.Uri.file(vscode.workspace.workspaceFolders![0].uri.fsPath),
                ],
            };

            this._webviewView.webview.onDidReceiveMessage(message => {
                switch (message.type) {
                    case 'onReady':
                        this._webviewView!.webview.postMessage({ type: 'project', project: Context.get('project') });
                    case 'runCommand':
                        vscode.commands.executeCommand(message.command, message.args);
                }
                // periodicaly send project data to webview
                setInterval(() => {
                    if (this._webviewView) {
                        this._webviewView!.webview.postMessage({ type: 'project', project: Context.get('project') });
                    }
                }, this._updateInterval);
            });
            this._webviewView.webview.html = this.getHtml();
        }
    }

    /**
     * Get html content for webview as string
     */
    private getHtml(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <base href="${vscode.Uri.file('.').with({ scheme: 'vscode-resource' })}/">
        </head>
        <body>
            <div id="root"></div>
            <script>
                window.acquireVsCodeApi = acquireVsCodeApi;
                window.WORKSPACE_URI = "${vscode.workspace.workspaceFolders![0].uri.fsPath}";
                window.EXTENSION_URI = "${this._extensionContext.extensionPath}";
            </script>
            <script src="${path.join(this._extensionContext.extensionPath, 'dist', `${this._bundleName}.js`)}"></script>
        </body>
        </html>
        `;
    }
}