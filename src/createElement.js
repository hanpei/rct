import Vnode from './vnode';

function createElement(type, config, ...children) {
  let props = Object.assign({}, config);

  props.children = []
    .concat(...children)
    .filter(i => i !== null)
    .map(c => (typeof c === 'object' ? c : createTextElement(c)));

  return new Vnode(type, props);
}

export default createElement;

function createTextElement(value) {
  if (typeof value === 'boolean') {
    return;
  }
  return createElement('TEXT_ELEMENT', { nodeValue: value });
}
