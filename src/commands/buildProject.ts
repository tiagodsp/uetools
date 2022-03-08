import * as vscode from 'vscode';
import { Context } from '../helpers/context';
import { UnrealEngineProject } from '../types';
import * as path from 'path';

export const buildProject = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            // check for project in the context
            const project = Context.get("project") as UnrealEngineProject;
            if (!project) {
                reject(new Error('No project found'));
                return;
            }

            // check for unreal engine installation
            let unrealEngineInstallation = Context.get("unrealEngineInstallation") as string;
            if (!unrealEngineInstallation) {
                await vscode.commands.executeCommand('uetools.selectUnrealEngineInstallation');
                unrealEngineInstallation = Context.get("unrealEngineInstallation") as string;
                if (!unrealEngineInstallation) {
                    reject(new Error('No unreal engine installation found'));
                    return;
                }
            }

            const projectFolder = Context.get("projectFolder") as string;

            // Create task to build project
            const shellCommand = new vscode.ShellExecution(
                `dotnet ${path.join(unrealEngineInstallation, "Engine/Binaries/DotNET/UnrealBuildTool/UnrealBuildTool.dll").replace(' ', '\\ ')} -mode=Build -ForceHotReload -project=${path.join(projectFolder, project.Modules[0].Name).replace(' ', '\\ ')}.uproject ${project.Modules[0].Name}Editor Mac Development`,
                { cwd: unrealEngineInstallation }
            );

            const task = new vscode.Task(
                { type: 'shell' },
                vscode.workspace.workspaceFolders![0],
                'Build Project',
                'UETools',
                shellCommand,
            );

            const taskList = Context.get("tasks") as vscode.Task[];
            const previousTaskIndex = taskList.findIndex((t) => t.name === task.name);
            if (previousTaskIndex > -1) {
                taskList.splice(previousTaskIndex, 1);
            }
            taskList.push(task);

            // Run task
            const execution = await vscode.tasks.executeTask(task);
            vscode.tasks.onDidEndTask((e) => {
                if (e.execution.task === execution.task) {
                    vscode.window.showInformationMessage(`Project ${project.Modules[0].Name} build completed`);
                    console.log('End: generateProjectFiles');
                    resolve(true);
                }
            });


        })();
    });
};