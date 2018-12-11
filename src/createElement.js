import Vnode from './vnode';

function initConfig(config) {
  return (config.ref = undefined);
}

function createElement(type, config, ...children) {
  let props = {};
  let key = null;
  let ref = null;

  if (config !== null) {
    key = config.key === undefined ? null : String(config.key);
    ref = config.ref === undefined ? null : config.ref;
  }

  props = {
    key,
    ref,
    children: children.length === 1 ? children[0] : children,
    ...config,
  };

  return new Vnode(type, props, key, ref);
}

export default createElement;
