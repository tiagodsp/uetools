import * as vscode from 'vscode';
import { Context } from '../../helpers/context';
import { UnrealEngineProject } from '../../types';



export const generateProjectFilesAndCompileCommands = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            // check for project in global state context
            const project = Context.get("project") as UnrealEngineProject;
            if (!project) {
                reject(new Error('No project found'));
                return;
            };
            await vscode.commands.executeCommand('uetools.generateProjectFiles')
                .then(async () => await vscode.commands.executeCommand('uetools.generateCompileCommands'));
        })();
    });
};