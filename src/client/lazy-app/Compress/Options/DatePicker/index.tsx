import { h, Component } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';

import Flatpickr from 'flatpickr';

interface Props extends preact.JSX.HTMLAttributes {}
interface State {}

export default class RangePicker extends Component<Props, State> {
  today = new Date();
  dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0'); //January is 0!
  yyyy = this.today.getFullYear();
  tomorrow = Number(this.dd) + 1;
  datestring = this.yyyy + this.mm + this.dd;

  render(props: Props, state: State) {
    return (
      <div>
        {/* @ts-ignore - TS bug https://github.com/microsoft/TypeScript/issues/16019 */}
        <input type="text" value={this.datestring + this.tomorrow} {...props} />
      </div>
    );
  }
}
