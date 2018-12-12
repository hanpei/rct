class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = this.state || {};
  }
  updateComponent() {
    const prevState = this.state;
    const oldVnode = this.vnode;

    if (this.nextState !== prevState) {
      this.state = this.nextState;
    }
    this.nextState = null;
    const newVnode = this.render();
    this.vnode = update(oldVnode, newVnode, this.dom);
  }
  setState(partialState) {
    this.nextState = Object.assign({}, this.state, partialState);
    return {
      ...this.state,
      ...partialState,
    };
    this.updateComponent();
  }
  render() {
    console.log(this);
  }
}

export default Component;

function update(oldVNode, newVnode, parentNode) {}
