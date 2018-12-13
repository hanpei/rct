import Component from './component';

function render(element, container) {
  return _render(element, container);
}

function _render(element, parentNode) {
  console.log(element);
  const dom = instantiate(element);
  // console.log(dom);
  parentNode.appendChild(dom);
}

export function instantiate(element) {
  // console.log(element);
  const isEmptyNode = element === undefined || element === null;
  const isTextNode = typeof element === 'string' || typeof element === 'number';
  const isDomNode =
    typeof element === 'object' && typeof element.type === 'string';
  const isComponentNode =
    typeof element === 'object' && typeof element.type === 'function';

  // empty
  if (isEmptyNode) {
    const node = document.createTextNode('');
    return node;
  }

  // text
  if (isTextNode) {
    const text = String(element);
    const node = document.createTextNode(element);
    return node;
  }

  // dom
  if (isDomNode) {
    const { type, props } = element;
    const hasChildren = props && props.children;

    const node = document.createElement(type);

    if (hasChildren) {
      if (Array.isArray(props.children)) {
        props.children.map(child => _render(child, node));
      } else {
        _render(props.children, node);
      }
    }

    setDomProps(node, props);
    return node;
  }

  // component
  if (isComponentNode) {
    const { type: ComponentClass, props } = element;
    const hasChildren = props && props.children && props.children.length > 0;

    if (ComponentClass.prototype && ComponentClass.prototype.render) {
      const instance = new ComponentClass(props);
      const renderedElement = instance.render();
      // console.log(renderedElement);
      instance.__dom = instantiate(renderedElement);
      return instance.__dom;
    } else {
      // TODO: function component
    }
  }
}

function mount(element) {}

function setDomProps(dom, props) {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const element = props[key];
      // 不添加children
      if (key === 'children') {
        continue;
      }
      // 样式处理
      if (key === 'style') {
        Object.keys(element).forEach(styleName => {
          dom.style[styleName] = element[styleName];
        });
        continue;
      }
      // 事件属性
      if (/^on[A-Z]/.test(key)) {
        const eventName = key.slice(2).toLowerCase();
        dom.addEventListener(eventName, element, false);
      }
      dom[key] = element;
    }
  }
}

export default render;
