import * as React from 'react';
import styled from 'styled-components';
import { Layout } from '../../styles/Layout';
import VSCodeWrapper from '../../../types/VSCodeApi';
import { UnrealEnginePlugin, UnrealEngineProject } from '../../../types';
import * as ModuleCard from './styles';
import { Project } from '../project';



interface PluginModuleCardProps {
    project: UnrealEngineProject;
    plugin: UnrealEnginePlugin;
}

export const PluginModuleCard: React.FC<PluginModuleCardProps> = (props) => {
    const [isMouseHovering, setIsMouseHovering] = React.useState(false);
    
    const onMouseEnter = () => {
        setIsMouseHovering(true);
    };

    const onMouseLeave = () => {
        setIsMouseHovering(false);
    };    

    const onBuildModule = () => {
        VSCodeWrapper.postMessage({
            type: 'runCommand',
            command: 'uetools.buildModule',
            args: {moduleName: props.plugin.Modules[0].Name},
       });
    };

    let isPluginEnabled = false;
    for(const p of props.project.Plugins)
    {
        if(p.Name === props.plugin.FriendlyName){
            isPluginEnabled = p.Enabled;
        }
    }

    
    return (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <ModuleCard.ModuleCard>
                    <ModuleCard.ModuleThumbnail img={VSCodeWrapper.workspaceUri + encodeURI(`/Plugins/${props.plugin.Modules[0].Name}/Resources/Icon128.png`)} width={100} height={100} />
                    <ModuleCard.ModuleDescription>
                        <ModuleCard.ModuleTitleWrapper>
                            <ModuleCard.ModuleTitle>{props.plugin.FriendlyName}</ModuleCard.ModuleTitle>
                            <ModuleCard.ModuleVersion>({props.plugin.VersionName})</ModuleCard.ModuleVersion>
                        </ModuleCard.ModuleTitleWrapper>
                        {isMouseHovering && (
                            <ModuleCard.ButtonsWrapper isHorizontal>
                                <ModuleCard.Button onClick={onBuildModule}>Build Module</ModuleCard.Button>
                            </ModuleCard.ButtonsWrapper>
                        )}
                        {!isMouseHovering && (
                            <div>
                                <ModuleCard.ModuleDescriptionText>{props.plugin.Description}</ModuleCard.ModuleDescriptionText>
                                <Layout>
                                    <ModuleCard.ModuleAuthor>by {props.plugin.CreatedBy}</ModuleCard.ModuleAuthor>
                                    <ModuleCard.ModduleAuthorUrl href={props.plugin.CreatedByURL}>{props.plugin.CreatedByURL}</ModuleCard.ModduleAuthorUrl>
                                </Layout>
                            </div>
                        )}
                    </ModuleCard.ModuleDescription>
                    {/* <ModuleCard.ModuleEnableCheckbox type="checkbox" checked={isPluginEnabled} /> */}
                </ModuleCard.ModuleCard>
        </div>
    );
};
