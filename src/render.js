import Component from './component';
import {instantiate} from './instantiate';

function render(element, container) {
  return _render(element, container);
}

export function _render(element, parentNode) {
  const instance = instantiate(element);
  
  const dom = instance.mount();
  parentNode.appendChild(dom);
}

export default render;
