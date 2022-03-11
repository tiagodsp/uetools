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

            const engineFolder = folders.find(folder => folder.includes(`UE_${project.EngineAssociation}`));
            if(!engineFolder) {
                reject(new Error(`Unreal Engine ${project.EngineAssociation} not found in ${unrealEngineInstallationSearchPath}`));
                return;
            }

            // // ask user to select a unreal engine installation from list with tip
            // const engineFolder = await vscode.window.showQuickPick(folders, { placeHolder: 'Select Unreal Engine Installation' });
            // if (!engineFolder) {
            //     reject(new Error('No Unreal Engine installation selected'));
            //     return;
            // }

            Context.set("unrealEngineInstallation", path.join(unrealEngineInstallationSearchPath, engineFolder));

            // check operating system
            const os = process.platform;
            
            // set UnrealBuildTool, UnrealEditor and Mono path based on Unreal version.
            // get engine version as number
            const engineVersion = parseInt(project.EngineAssociation.replace('UE_', ''));
            if(engineVersion === 4) {
                if(os === 'win32') {
                    Context.set("unrealBuildToolPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/DotNET/UnrealBuildTool.exe'));
                    Context.set("unrealEditorPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/Win64/UE4Editor.exe'));
                    Context.set("runtimePath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/ThirdParty/Mono/Win64/bin/mono.exe'));
                } else if(os === 'darwin') {
                    Context.set("unrealBuildToolPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/DotNET/UnrealBuildTool.exe'));
                    Context.set("unrealEditorPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/Mac/UE4Editor.app/Contents/MacOS/UnrealEditor'));
                    Context.set("runtimePath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/ThirdParty/Mono/Mac/bin/mono'));
                } else if(os === 'linux') {
                    Context.set("unrealBuildToolPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/DotNET/UnrealBuildTool.exe'));
                    Context.set("unrealEditorPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/Linux/UE4Editor'));
                    Context.set("runtimePath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/ThirdParty/Mono/Linux/bin/mono'));
                } else {
                    reject(new Error(`Unsupported operating system: ${os}`));
                }
            } else if(engineVersion === 5) {
                if(os === 'win32') {
                    Context.set("unrealBuildToolPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/DotNET/UnrealBuildTool/UnrealBuildTool.dll'));
                    Context.set("unrealEditorPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/Win64/UnrealEditor.exe'));
                    Context.set("runtimePath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/ThirdParty/Mono/Win64/bin/mono.exe'));
                } else if(os === 'darwin') {
                    Context.set("unrealBuildToolPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/DotNET/UnrealBuildTool/UnrealBuildTool.dll'));
                    Context.set("unrealEditorPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/Mac/UnrealEditor.app/Contents/MacOS/UnrealEditor'));
                    Context.set("runtimePath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/ThirdParty/DotNet/Mac/dotnet'));
                } else if(os === 'linux') {
                    Context.set("unrealBuildToolPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/DotNET/UnrealBuildTool/UnrealBuildTool.dll'));
                    Context.set("unrealEditorPath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/Linux/UnrealEditor'));
                    Context.set("runtimePath", path.join(Context.get('unrealEngineInstallation') as string, 'Engine/Binaries/ThirdParty/Mono/Linux/bin/mono'));
                } else {
                    reject(new Error(`Unsupported operating system: ${os}`));
                }
            } else {
                reject(new Error(`Unreal Engine ${project.EngineAssociation} not supported`));
                return;
            }

            // Notify user the selected unreal engine installation
            vscode.window.showInformationMessage(`Unreal Engine installation ${engineFolder} selected.`);
            console.log(`Unreal Engine installation selected.`);
            resolve(true);
        })();
    });
};