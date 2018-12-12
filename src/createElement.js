import Vnode from './vnode';

function childrenHandler(children) {
  if (children.length === 1) {
    console.log('====');
    children = children[0] === undefined ? [] : children[0];
  } else {
    children = children.filter(child => child !== undefined);
  }
  return children;
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
    children: childrenHandler(children),
    ...config,
  };

  return new Vnode(type, props, key, ref);
}

export default createElement;
