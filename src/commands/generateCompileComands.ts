import * as vscode from 'vscode';
import { UnrealEngineProject } from '../types';
import * as path from 'path';
import * as fs from 'fs';
import { Context } from '../helpers/context';

/**
 * Generate compile commands for the current project
 */
export const generateCompileCommands = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            // check for project in global state context
            const project = Context.get("project") as UnrealEngineProject;
            if (!project) {
                reject(new Error('No project found'));
                return;
            };

            // check for unreal engine installation
            const unrealEngineInstallation = Context.get("unrealEngineInstallation") as string;
            const unrealBuildToolPath = Context.get("unrealBuildToolPath") as string;
            const runtimePath = Context.get("runtimePath") as string;
            const projectFolder = Context.get("projectFolder") as string;

            vscode.window.showInformationMessage(`Generating compile commands for ${project.Modules[0].Name}`);

            // Delete previous compile_commands.json
            const compileCommandsFile = path.join(projectFolder, 'compile_commands.json');
            if (fs.existsSync(compileCommandsFile)) {
                fs.unlinkSync(compileCommandsFile);
            }

            // Create task to generate compile_commands.json
            const os = process.platform;
            const scapeSpace = os === "win32" ? '^ ' : '\\ ';
            let buildOsType = "";
            let shellCommand;
            // TODO - Check for a better way to create shell commands for different OSes and avoid this big if/else statements
            if (os === "win32") {
                buildOsType = "Win64";
                shellCommand = new vscode.ShellExecution(
                    `"${unrealBuildToolPath}" -mode=GenerateClangDatabase -project=${path.join(projectFolder, project.Modules[0].Name)}.uproject ${project.Modules[0].Name}Editor ${buildOsType} Development`,
                    { cwd: unrealEngineInstallation, executable: runtimePath}
                );
            } else if (os === "darwin") {
                buildOsType = "Mac";
                shellCommand = new vscode.ShellExecution(
                    `${runtimePath.split(" ").join("\\ ")} ${unrealBuildToolPath.split(" ").join("\\ ")} -mode=GenerateClangDatabase -project=${path.join(projectFolder, project.Modules[0].Name).split(" ").join("\\ ")}.uproject ${project.Modules[0].Name}Editor ${buildOsType} Development`,
                    { cwd: unrealEngineInstallation }
                );
            } else if (os === "linux") {
                buildOsType = "Linux";
                shellCommand = new vscode.ShellExecution(
                    `${runtimePath.split(" ").join("\\ ")} ${unrealBuildToolPath.split(" ").join("\\ ")} -mode=GenerateClangDatabase -project=${path.join(projectFolder, project.Modules[0].Name).split(" ").join("\\ ")}.uproject ${project.Modules[0].Name}Editor ${buildOsType} Development`,
                    { cwd: unrealEngineInstallation }
                );
            }

            const task = new vscode.Task(
                { type: 'shell' },
                vscode.workspace.workspaceFolders![0],
                'Generate Compile Commands',
                'UETools',
                shellCommand,
            );

            const taskList = Context.get("tasks") as vscode.Task[];
            const previousTaskIndex = taskList.findIndex((t) => t.name === task.name);
            if (previousTaskIndex > -1) {
                taskList.splice(previousTaskIndex, 1);
            };
            taskList.push(task);

            // Run task
            const execution = await vscode.tasks.executeTask(task);

            // Wait for task to finish
            vscode.tasks.onDidEndTask((e) => {
                if (e.execution.task === execution.task) {
                    // check if compile_commands.json was generated on engine installation folder and move it to project folder
                    const newCompileCommandsFile = path.join(unrealEngineInstallation, 'compile_commands.json');
                    if (!fs.existsSync(newCompileCommandsFile)) {
                        vscode.window.showErrorMessage(`Could not generate compile_commands.json for ${project.Modules[0].Name}. Intelisense may not work for clangd.`);
                        console.log('End: generateCompileCommands');
                        return;
                    }
                    fs.renameSync(newCompileCommandsFile, compileCommandsFile);

                    // set compile_commands.json relative dir in clangd arguments in workspace settings
                    const clangd = vscode.workspace.getConfiguration('clangd', vscode.workspace.workspaceFolders![0]).get('arguments') as string[];
                    const clangdIndex = clangd.findIndex((arg) => arg.startsWith('--compile-commands-dir'));
                    if (clangdIndex !== -1) {
                        clangd[clangdIndex] = `--compile-commands-dir=${projectFolder}`;
                    } else {
                        clangd.push(`--compile-commands-dir=${projectFolder}`);
                    }
                    vscode.workspace.getConfiguration('clangd', vscode.workspace.workspaceFolders![0]).update('arguments', clangd, vscode.ConfigurationTarget.Workspace, true);

                    resolve(true);
                }
            });
        })();
    });
};