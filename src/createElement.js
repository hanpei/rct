import Vnode from './vnode';

function createElement(type, config, ...children) {
  let props = {};
  let key = null;
  let ref = null;

  config = config === null ? {} : config;
  key = config.key === undefined ? null : String(config.key);
  ref = config.ref === undefined ? null : config.ref;

  children = children
    .filter(child => child !== undefined || child !== null)
    .map(c => (c instanceof Object ? c : createTextElement(c)));

  props = {
    key,
    ref,
    children,
    ...config,
  };

  return new Vnode(type, props, key, ref);
}

export default createElement;

function createTextElement(value) {
  return createElement('TEXT_ELEMENT', { nodeValue: value });
}
