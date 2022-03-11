import * as vscode from 'vscode';

export const changeEngineVersionRoutine = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            await (vscode.commands.executeCommand('uetools.changeEngineVersion') as Promise<boolean>)
                .then(() => vscode.commands.executeCommand('uetools.checkUnrealProject'))
                .then(() => vscode.commands.executeCommand('uetools.generateProjectFilesAndCompileCommands'))
                .catch((reason) => {
                    console.log(reason);
                    vscode.window.showErrorMessage(reason.message);
                    reject(reason);
                });
        })();
    });
};