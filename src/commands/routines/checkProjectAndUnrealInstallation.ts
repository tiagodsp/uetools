import * as vscode from 'vscode';

export const checkProjectAndUnrealInstallation = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            await vscode.commands.executeCommand('uetools.checkUnrealProject')
                .then(async () => { await vscode.commands.executeCommand('uetools.selectUnrealEngineInstallation'); });
        })();
    });
};