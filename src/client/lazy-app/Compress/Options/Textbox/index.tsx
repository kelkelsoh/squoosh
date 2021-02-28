import { h, Component } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';

interface Props extends preact.JSX.HTMLAttributes {}
interface State {}

export default class Textbox extends Component<Props, State> {
  render(props: Props) {
    return (
      <div>
        {/* @ts-ignore - TS bug https://github.com/microsoft/TypeScript/issues/16019 */}
        <input type="text" {...props} />
      </div>
    );
  }
}
