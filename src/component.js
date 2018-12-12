import { _render } from './render';
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
    this.dom = this.vnode._hostNode;
  }
  setState(partialState) {
    this.nextState = Object.assign({}, this.state, partialState);
    this.updateComponent();
  }
  render() {}
}

export default Component;

export function update(oldVnode, newVnode, parentDomNode) {
  newVnode._hostNode = oldVnode._hostNode;
  console.log(oldVnode._hostNode);
  console.log(newVnode._hostNode);
  const dom = _render(newVnode, parentDomNode, true);
  newVnode._hostNode = dom;
  return newVnode;
}
