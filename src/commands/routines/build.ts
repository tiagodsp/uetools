import * as vscode from 'vscode';

export const buildAndGenerateCompileCommands = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            await (vscode.commands.executeCommand('uetools.buildProject') as Promise<boolean>)
                .then(() => vscode.commands.executeCommand('uetools.generateCompileCommands'))
                .catch((reason) => {
                    console.log(reason);
                    vscode.window.showErrorMessage(reason.message);
                    reject(reason);
                });
        })();
    });
};