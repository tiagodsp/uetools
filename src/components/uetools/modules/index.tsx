import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { UnrealEngineProject } from '../../../types';
import VSCodeWrapper from '../../../types/VSCodeApi';
import styled from 'styled-components';
import { Layout } from '../../styles/Layout';
import { PluginModuleCard } from './pluginModuleCard';
import { GameModuleCard } from './gameModuleCard';



export const Modules = () => {
    const [project, setProject] = React.useState<UnrealEngineProject>();

    VSCodeWrapper.onMessage((message) => {
        if(message.data.type === 'project') {
            setProject(message.data.project);
        }
    });

    return (
        <>
            {project && project.Modules && project.Modules.map((module) => {
                return (
                    <GameModuleCard key={module.Name} project={project} module={module} />
                );
            })}
            {project && project.ProjectPlugins && project.ProjectPlugins.map((plugin, index) => {
                return (
                    <PluginModuleCard key={plugin.FriendlyName} project={project} plugin={plugin}/>
                );
            })}
        </>
    );

};

ReactDOM.render(
    <Modules/>,
    document.getElementById('root')
);

VSCodeWrapper.postMessage({type: 'onReady', data: 'Hello from the extension!'});