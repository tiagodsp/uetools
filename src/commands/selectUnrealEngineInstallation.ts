import * as vscode from 'vscode';
import { UnrealEngineProject } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { Context } from '../helpers/context';

export const selectUnrealEngineInstallation = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {

            // check for project in the context
            const project = Context.get('project') as UnrealEngineProject;

            if (!project) {
                reject(new Error('No project found'));
                return;
            }

            // get unreal engine installation seach path and check if the version associated with project is installed
            const unrealEngineInstallationSearchPath = vscode.workspace.getConfiguration().get('uetools.unrealEngineInstallationSearchPath') as string;
            const folders = fs.readdirSync(unrealEngineInstallationSearchPath);

            if (folders.length === 0) {
                vscode.window.showInformationMessage(`Unreal Engine version not found. Please install the version associated with the project (Version ${project.EngineAssociation}).`);
            }

            // ask user to select a unreal engine installation from list with tip
            const engineFolder = await vscode.window.showQuickPick(folders, { placeHolder: 'Select Unreal Engine Installation' });
            if (!engineFolder) {
                reject(new Error('No Unreal Engine installation selected'));
                return;
            }

            Context.set("unrealEngineInstallation", path.join(unrealEngineInstallationSearchPath, engineFolder));

            // Notify user the selected unreal engine installation
            vscode.window.showInformationMessage(`Unreal Engine installation ${engineFolder} selected.`);
            console.log(`Unreal Engine installation selected.`);
            resolve(true);
        })();
    });
};