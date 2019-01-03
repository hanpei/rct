import patch from './patch';
import diff from './diff';
import instantiate from './instance';

class Component {
  constructor(props) {
    this.props = props;
    this.state = null;
  }
  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    this.__updater(this.__internalInstance);
  }
  __updater(instance) {
    console.log(instance);
    const parentDom = instance.dom.parentNode;
    const prevElement = instance.element;
    const nextElement = instance.publicInstance.render();
    console.log(prevElement, nextElement);
    const patches = diff(prevElement, nextElement);
    console.log(patches);
    patch(parentDom, patches);
    instance.element = nextElement;
  }
  render() {}
}

export default Component;
