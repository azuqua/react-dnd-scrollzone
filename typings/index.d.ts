import { ComponentType } from 'react';

type StrengthFunction = (
    rect: {
        x: number; 
        y: number;
        w: number;
        h: number;
    }, 
    point: {
        x: number;
        y: number;
    }
) => number;

declare function createHorizontalStrength(_buffer: number): StrengthFunction;
declare function createVerticalStrength(_buffer: number): StrengthFunction;

declare const defaultHorizontalStrength: StrengthFunction;
declare const defaultVerticalStrength: StrengthFunction;

interface IScrollingInjectedProps {
    onScrollChange?: (left: number, top: number) => void,
    verticalStrength?: StrengthFunction;
    horizontalStrength?: StrengthFunction;
    strengthMultiplier?: number;
    getScrollContainer?: (element: HTMLElement) => HTMLElement;
}

declare function createScrollingComponent<Props>(Component: ComponentType<Props> ): ComponentType<Props & IScrollingInjectedProps>;
export default createScrollingComponent;
