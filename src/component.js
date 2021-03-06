class Component {
  constructor(props) {
    this.props = props;
    this.state = null;
  }
  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    this.__updater();
  }
  __updater() {}
  render() {}
}

export default Component;
