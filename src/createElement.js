import Vnode from './vnode';

function createElement(type, config, ...children) {
  let props = {};
  let key = null;
  let ref = null;

  config = config === null ? {} : config;
  key = config.key === undefined ? null : String(config.key);
  ref = config.ref === undefined ? null : config.ref;

  if (children.length === 1) {
    children = children[0];
  } else {
    children = children.filter(child => child !== undefined || child !== null);
  }

  props = {
    key,
    ref,
    children,
    ...config,
  };

  return new Vnode(type, props, key, ref);
}

export default createElement;
