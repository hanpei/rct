import instantiate from './instance';

function render(element, container) {
  console.log(element);
  const instance = instantiate(element);
  const dom = instance.mount()
  container.appendChild(dom);
}

export default render;
