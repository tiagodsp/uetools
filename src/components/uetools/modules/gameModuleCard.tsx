import * as React from 'react';
import styled from 'styled-components';
import { Layout } from '../../styles/Layout';
import VSCodeWrapper from '../../../types/VSCodeApi';
import { UnrealEnginePlugin, UnrealEngineProject, UnrealModule } from '../../../types';
import * as ModuleCard from './styles';

export const GameModuleCard : React.FC<{project: UnrealEngineProject, module: UnrealModule}> = (props) => {
    return (
        <ModuleCard.ModuleCard>
            <ModuleCard.ModuleThumbnail img={encodeURI(`${VSCodeWrapper.workspaceUri}/${props.module.Name}.png`)} width={100} height={100} />
            <ModuleCard.ModuleDescription>
                <ModuleCard.ModuleTitleWrapper>
                    <ModuleCard.ModuleTitle>{props.module.Name}</ModuleCard.ModuleTitle>
                </ModuleCard.ModuleTitleWrapper>
            </ModuleCard.ModuleDescription>
        </ModuleCard.ModuleCard>
    );
};