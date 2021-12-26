import * as React from 'react';
import { MessageProps, Theme } from '../definitions/Component';
declare class ConsoleMessage extends React.PureComponent<MessageProps, any> {
    theme: (theme: Theme) => {
        method: import("../definitions/Methods").Methods;
        variant: import("../definitions/Component").Variants;
        styles: import("../definitions/Styles").Styles;
    };
    render(): JSX.Element;
    getNode(): JSX.Element;
    typeCheck(log: any): false | JSX.Element;
}
export default ConsoleMessage;
