class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }
  setState(partialState) {
    return {
      ...this.state,
      ...partialState,
    };
  }
  render() {}
}

export default Component;
