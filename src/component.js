import { instantiate } from './render';

class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }
  setState(partialState) {
    const prevState = this.state;
    const nextState = Object.assign({}, this.state, partialState);
    this.state = nextState;
    const element = this.render();
    console.log(element);
    const prevDom = this.__dom;
    const nextDom = instantiate(element)
    const parentDom = prevDom.parentNode;
    parentDom.replaceChild(nextDom, prevDom);
    this.__dom = nextDom;
  }
  render() {}
}

export default Component;
