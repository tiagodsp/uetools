import * as vscode from 'vscode';

export const buildAndGenerateCompileCommands = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            await vscode.commands.executeCommand('uetools.buildProject')
                .then(async () => await vscode.commands.executeCommand('uetools.generateCompileCommands'))
                .then(() => resolve(true));
        })();
    });
};