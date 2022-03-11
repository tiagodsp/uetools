import * as vscode from 'vscode';
import { Context } from '../../helpers/context';
import { UnrealEngineProject } from '../../types';

export const generateProjectFilesAndCompileCommands = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            await (vscode.commands.executeCommand('uetools.generateProjectFiles') as Promise<boolean>)
                .then(() => vscode.commands.executeCommand('uetools.generateCompileCommands'))
                .catch((reason) => {
                    console.log(reason);
                    vscode.window.showErrorMessage(reason.message);
                    reject(reason);
                });
        })();
    });
};