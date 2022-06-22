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
            const unrealEngineInstallation = Context.get("unrealEngineInstallation") as string;
            const unrealBuildToolPath = Context.get("unrealBuildToolPath") as string;
            const runtimePath = Context.get("runtimePath") as string;
            const projectFolder = Context.get("projectFolder") as string;

            // Create task to build project
            const os = process.platform;
            const scapeSpace = os === "win32" ? '` ' : '\\ '; 
            let buildOsType = "";
            if (os === "win32") {
                buildOsType = "Win64";
            } else if (os === "darwin") {
                buildOsType = "Mac";
            } else if (os === "linux") {
                buildOsType = "Linux";
            }
            const shellCommand = new vscode.ShellExecution(
                `"${unrealBuildToolPath}" -mode=Build -ForceHotReload -project="${path.join(projectFolder, project.Modules[0].Name)}.uproject" ${project.Modules[0].Name}Editor ${buildOsType} Development`,
                { cwd: unrealEngineInstallation, executable: runtimePath }
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