import Component from './component';

function render(vnode, container) {
  return _render(vnode, container);
}

function _render(vnode, container) {
  console.log(vnode);
  let domNode;
  if (vnode === undefined || vnode === null) {
    return;
  }

  // text
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    domNode = renderTextNode(String(vnode), container);
  }

  // dom
  if (typeof vnode.type === 'string') {
    domNode = renderDomNode(vnode, container);
  }

  // component
  if (typeof vnode.type === 'function') {
    domNode = renderComponent(vnode, container);
  }
  container.appendChild(domNode);
  return domNode;
}

function renderTextNode(vnode, parentNode) {
  
  const textNode = document.createTextNode(String(vnode));
  return textNode;
}

function renderDomNode(vnode, container) {
  // debugger
  const dom = document.createElement(vnode.type);
  setAttrbutes(dom, vnode.props);
  let children = [];
  if (!Array.isArray(vnode.props.children)) {
    children = [vnode.props.children];
  } else {
    children = vnode.props.children;
  }
  children.forEach(child => _render(child, dom));
  return dom;
}

function renderComponent(vnode, parent) {
  const { type: ComponentConstructor, props } = vnode;
  let instance;
  if (ComponentConstructor.prototype && ComponentConstructor.prototype.render) {
    // 处理class组件
    instance = new ComponentConstructor(props);
  } else {
    // 处理functional组件
    instance = new Component(props);
    instance.render = function() {
      return ComponentConstructor(props);
    };
  }
  const renderdVnode = instance.render();
  const domNode = _render(renderdVnode, parent);
  return domNode;
}

function setAttrbutes(dom, props) {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const element = props[key];
      if (key === 'children') {
        continue;
      }
      if (key === 'style') {
        Object.keys(element).forEach(styleName => {
          dom.style[styleName] = element[styleName];
        });
        continue;
      }
      dom[key] = element;
    }
  }
}

export default render;
