import instantiate from './instance';
import patch from './patch';
import diff from './diff';

function render(element, container) {
  const instance = instantiate(element);
  const patches = diff(null, element);
  patch(container, patches);
}

export default render;
