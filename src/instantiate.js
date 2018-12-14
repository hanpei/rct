
export function instantiate(element) {
  console.log(element);
  const { type, props } = element;
  const isEmptyNode = element === undefined || element === null;
  const isTextNode = type === 'TEXT_ELEMENT';
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
    const node = document.createTextNode(element.props.nodeValue);
    return node;
  }

  // dom
  if (isDomNode) {
    const { type, props } = element;
    const hasChildren = props.hasOwnProperty('children');

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
    const { type: ComponentCtor, props } = element;
    const hasChildren = props.hasOwnProperty('children');

    let instance;
    if (ComponentCtor.prototype && ComponentCtor.prototype.render) {
      instance = new ComponentCtor(props);
    } else {
      instance = new Component(props);
      instance.constructor = ComponentCtor;
      instance.render = function() {
        return ComponentCtor(props);
      };
    }

    const renderedElement = instance.render();
    instance.__dom = instantiate(renderedElement);
    return instance.__dom;
  }
}

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
