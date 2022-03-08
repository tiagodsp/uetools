import * as React from 'react';
import styled from 'styled-components';

export const Layout = styled.div<{isVertical?: boolean}>`
    display: flex;
    flex-direction: ${props => props.isVertical ? 'column' : 'row'};
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
    overflow: hidden;
    border-radius: 5px;
`;