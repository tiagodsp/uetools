import * as React from 'react';
import styled from "styled-components";

// Card with module thumbnail and description
export const ModuleCard = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
    overflow: hidden;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #333333;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
`;

export const ModuleThumbnail = styled.div<{img: string, width: number, height: number}>`
    width: ${props => props.width}px;
    min-width: ${props => props.width}px;
    height: ${props => props.height}px;
    min-height: ${props => props.height}px;
    background-image: url(${props => props.img});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 5px;
    margin-right: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
`;


export const ModuleDescription = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    flex-grow: 2;
    flex-shrink: 1;
    padding: 10px;
    border-radius: 5px;
`;



export const ModuleDescriptionText = styled.p`
    font-size: 1em;
    margin: 0;
    font-weight: 100;
    overflow-y: hidden;
`;

export const ModuleAuthor = styled.p`
    font-size: 0.8em;
    margin: 0;
    font-weight: 100;
`;

export const ModduleAuthorUrl = styled.a`
    font-size: 0.8em;
    margin: 0;
    font-weight: 100;
    color: #0078d7;
    text-decoration: underline;
`;

export const ModuleEnableCheckbox = styled.input`
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
`;

export const ModuleTitleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: left;
    align-items: stretch;
    align-content: stretch;
`;

export const ModuleTitle = styled.h1`
    font-size: 1.5em;
    font-weight: bold;
    margin: 0;
`;

export const ModuleVersion = styled.p`
    font-size: 0.8em;
    padding-left: 5px;
    font-weight: 100;
`;

// Bootstrap like blue button
export const Button = styled.button`
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

export const ButtonsWrapper = styled.div<{isHorizontal?: boolean}>`
    display: flex;
    flex-direction: ${(props) => props.isHorizontal ? 'row' : 'column'};
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