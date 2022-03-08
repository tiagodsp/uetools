// draw a button with a text
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as path from 'path';
import VSCodeWrapper from '../../../types/VSCodeApi';
import { UnrealEngineProject } from '../../../types';
import styled from 'styled-components';
import { Layout } from '../../styles/Layout';

// Base panel with components on horizontal layout
// to the left the thumbnail with fixed size, to the right the project description
// if to narrow, the thumbnail goes to the top and the project description goes to the bottom
const DescriptionPanel = styled.div`
    position: relative;
    padding: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
    overflow: hidden;
    border-radius: 5px;
`;

// Project details Panel with translucent glass effect background
const ProjectDetailsPanel = styled.div`
    flex-grow: 2;
    padding: 10px;
    border-radius: 5px;
    background-color: #00000099;
`;

// Splash background image and fit to the div
const BackgroundImage = styled.div<{img: string}>`
    background-image: url(${props => props.img});
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -100;
`;

// project thumbnail with fixed aspect ratio
const ProjectThumbnail = styled.div<{img: string, width: number, height: number}>`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    background-image: url(${props => props.img});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 5px;
    margin-right: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
`;

const ProjectTitle = styled.h1`
    font-size: 1.5em;
    font-weight: bold;
    margin: 0;
    color: white;
`;

const Text = styled.p`
    margin: 0;
`;

// Bootstrap like blue button
const Button = styled.button`
    background-color: #007bff;
    border-color: #007bff;
    color: white;
    border-radius: 5px;
    padding: 5px 10px;
    margin: 5px;
    font-size: 0.8em;
    font-weight: bold;
    cursor: pointer;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;
    align-content: stretch;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #333333;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
`;

export const Project = () => 
{   
    const [project, setProject] = React.useState<UnrealEngineProject>();

    VSCodeWrapper.onMessage((message) => {
        setProject(message.data.project);
    });

    const onOpenProject = () => {
        VSCodeWrapper.postMessage({
            type: 'runCommand',
            command: 'uetools.openProjectEditor',
        });
    };

    const onGenerateProjectFiles = () => {
        VSCodeWrapper.postMessage({
            type: 'runCommand',
            command: 'uetools.generateProjectFilesAndCompileCommands',
        });
    };


    const onBuildProject = () => {
        VSCodeWrapper.postMessage({
            type: 'runCommand',
            command: 'uetools.buildAndGenerateCompileCommands',
        });
    };

    return (
        <>
            <DescriptionPanel>
                <BackgroundImage img={encodeURI(`${VSCodeWrapper.extensionUri}/res/images/uesplash.jpg`)}/>
                <ProjectThumbnail img={encodeURI(`${VSCodeWrapper.workspaceUri}/${project?.Modules[0].Name}.png`)} width={100} height={100}/>
                <ProjectDetailsPanel>
                    <ProjectTitle>{project?.Modules[0].Name}</ProjectTitle>
                    <Text>Unreal Engine {project?.EngineAssociation}</Text>
                </ProjectDetailsPanel>
            </DescriptionPanel>
            <ButtonsWrapper>
                <Button onClick={onOpenProject}>
                    Open in Unreal Editor
                </Button>
                <Button onClick={onGenerateProjectFiles}>
                    Generate Project Files
                </Button>
                <Button onClick={onBuildProject}>
                    Build
                </Button>
            </ButtonsWrapper>
        </>
    );
};

VSCodeWrapper.postMessage({type: 'onReady', data: 'Hello from the extension!'});
ReactDOM.render(
	<Project/>,
	document.getElementById('root')
);