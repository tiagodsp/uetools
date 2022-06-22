import * as vscode from 'vscode';
import { UnrealEngineProject } from '../types';
import * as path from 'path';
import { Context } from '../helpers/context';

export const generateProjectFiles = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            console.log('Begin: generateProjectFiles');

            // check for project in the context
            const project = Context.get("project") as UnrealEngineProject;
            if (!project) {
                reject(new Error('No project found'));
                return;
            }

            await vscode.commands.executeCommand('uetools.detectUnrealEngineInstallation');

            // check for unreal engine installation
            const unrealEngineInstallation = Context.get("unrealEngineInstallation") as string;
            const unrealBuildToolPath = Context.get("unrealBuildToolPath") as string;
            const runtimePath = Context.get("runtimePath") as string;
            const projectFolder = Context.get("projectFolder") as string;
            vscode.window.showInformationMessage(`Generating project files for ${project.Modules[0].Name}`);

            // Create task to generate project files
            const os = process.platform;
            let buildOsType = "";
            let shellCommand;
            // TODO - Check for a better way to create shell commands for different OSes and avoid this big if/else statements
            if (os === "win32") {
                buildOsType = "Win64";
                shellCommand = new vscode.ShellExecution(
                    `"${unrealBuildToolPath}" -mode=GenerateProjectFiles -project="${path.join(projectFolder, project.Modules[0].Name)}.uproject" ${project.Modules[0].Name}Editor ${buildOsType} Development`,
                    { cwd: unrealEngineInstallation, executable: runtimePath }
                );
            }
            else if (os === "darwin") {
                buildOsType = "Mac";
                shellCommand = new vscode.ShellExecution(
                    `${runtimePath.split(" ").join("\\ ")} ${unrealBuildToolPath.split(" ").join("\\ ")} -mode=GenerateProjectFiles -project=${path.join(projectFolder, project.Modules[0].Name).split(" ").join("\\ ")}.uproject ${project.Modules[0].Name}Editor ${buildOsType} Development`,
                    { cwd: unrealEngineInstallation }
                );
            }
            else if (os === "linux") {
                buildOsType = "Linux";
                shellCommand = new vscode.ShellExecution(
                    `${runtimePath.split(" ").join("\\ ")} ${unrealBuildToolPath.split(" ").join("\\ ")} -mode=GenerateProjectFiles -project=${path.join(projectFolder, project.Modules[0].Name).split(" ").join("\\ ")}.uproject ${project.Modules[0].Name}Editor ${buildOsType} Development`,
                    { cwd: unrealEngineInstallation }
                );
            }

            const task = new vscode.Task(
                { type: 'shell' },
                vscode.workspace.workspaceFolders![0],
                'Generate Project Files',
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
                    vscode.window.showInformationMessage(`Project files generated for ${project.Modules[0].Name}`);
                    console.log('End: generateProjectFiles');
                    resolve(true);
                }
            });
        })();
    });
};

/**
 * Check if the workspace contains a UProject file and ask the user if he wants to generate the project files
 */
export const askProjectFilesGeneration = async () => {
    // check for project in global state context
    const project = Context.get("project") as UnrealEngineProject;
    if (!project) {
        // ask if user wants to scan for a project
        await vscode.window.showInformationMessage('No project found. Would you like to scan for a project?', 'Yes', 'No').then(answer => {
            if (answer === 'Yes') {
                // scan for a project
                vscode.commands.executeCommand('uetools.checkUnrealProject');
            }
        });
        return;
    };

    // ask for project generation
    const answer = await vscode.window.showInformationMessage('Would you like to generate project files?', 'Yes', 'No');
    if (answer === 'Yes') {
        // generate project files
        await vscode.commands.executeCommand('uetools.generateProjectFiles')
            .then(() => vscode.commands.executeCommand('uetools.generateCompileCommands'));
    }
};