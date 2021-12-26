import * as React from 'react';
import { Message } from '../../definitions/Component';
interface Props {
    log: Message;
}
declare class ErrorPanel extends React.PureComponent<Props, any> {
    render(): JSX.Element;
}
export default ErrorPanel;
