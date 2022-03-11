// Check if the workspace contains a UProject file
import * as fs from 'fs';
import { Context } from '../helpers/context';
import * as vscode from 'vscode';

// import types
import { UnrealEngineProject, UnrealEnginePlugin } from '../types';

const checkUnrealProject = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        (async () => {
            const workspaceFolders = vscode.workspace.workspaceFolders;

            // Check if the workspaces contains a any file with the extension .uproject
            if (workspaceFolders) {
                for (const folder of workspaceFolders) {
                    const files = fs.readdirSync(folder.uri.fsPath);
                    for (const file of files) {
                        if (file.endsWith('.uproject')) {
                            // parse the file and cast it as UnrealEngineProject
                            const project = JSON.parse(fs.readFileSync(`${folder.uri.fsPath}/${file}`, 'utf8')) as UnrealEngineProject;

                            // if Plugins folder exists, check each subfolder for a .uplugin file
                            if (fs.existsSync(`${folder.uri.fsPath}/Plugins`)) {
                                const pluginDirs = fs.readdirSync(`${folder.uri.fsPath}/Plugins`);
                                project.ProjectPlugins = [];
                                for (const pluginDir of pluginDirs) {
                                    if (fs.existsSync(`${folder.uri.fsPath}/Plugins/${pluginDir}/${pluginDir}.uplugin`)) {
                                        const plugin = JSON.parse(fs.readFileSync(`${folder.uri.fsPath}/Plugins/${pluginDir}/${pluginDir}.uplugin`, 'utf8')) as UnrealEnginePlugin;
                                        project.ProjectPlugins.push(plugin);
                                    }
                                }
                            }

                            //persist project workspace folder
                            Context.set('projectFolder', folder.uri.fsPath);

                            // persist the UnrealEngineProject in the global state
                            Context.set('project', project);

                            // notify the user that the workspace is a valid Unreal Engine project
                            vscode.window.showInformationMessage(`Unreal Engine project ${project.Modules[0].Name} found associated with Engine Version: ${project.EngineAssociation}.`);

                            // save the project information in vscode workspace settings
                            vscode.workspace.getConfiguration().update('uetools.project', project, vscode.ConfigurationTarget.WorkspaceFolder);

                            Context.events.onProjectChanged.emit(project);
                            resolve(true);
                        }
                    }
                }
            }
        })();
    });
};

export default checkUnrealProject;