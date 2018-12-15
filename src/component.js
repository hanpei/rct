import { instantiate } from './render';

class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
    this.__updater = null;
  }
  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    this.__updater();
  }
  render() {}
}

export default Component;
