import Vnode from './vnode';

function createElement(type, config, ...children) {
  let props = Object.assign({}, config);

  props.children = [].concat(...children).filter(i => i !== undefined || i !== null);

  return new Vnode(type, props);
}

export default createElement;
