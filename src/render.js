import instantiate from './instance';

function render(element, container) {
  const instance = instantiate(element);
  const dom = instance.mount();
  container.appendChild(dom);
}

export default render;
