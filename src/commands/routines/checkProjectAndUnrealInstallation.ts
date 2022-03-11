import * as vscode from 'vscode';

export const checkProjectAndUnrealInstallation = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            await (vscode.commands.executeCommand('uetools.checkUnrealProject') as Promise<boolean>)
                .then(() => vscode.commands.executeCommand('uetools.detectUnrealEngineInstallation'))
                .catch((reason) => {
                    console.log(reason);
                    vscode.window.showErrorMessage(reason.message);
                    reject(reason);
                });
        })();
    });
};