function render(vnode, container) {
  return container.appendChild(_render(vnode));
}

function _render(vnode) {
  // null or undefined
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
    vnode = '';
  }

  // text
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    const textNode = document.createTextNode(String(vnode));
    return textNode;
  }

  // dom
  if (typeof vnode.type === 'string') {
    const dom = document.createElement(vnode.type);
    setAttrbutes(dom, vnode.props);
    if (typeof vnode.props.children === 'string') {
      render(vnode.props.children, dom);
    } else {
      vnode.props.children.forEach(child => render(child, dom));
    }
    return dom;
  }

  // component
  if (typeof vnode.type === 'function') {
    // console.log(vnode.type);
    return renderComponent(vnode.type, vnode.props);
  }
}

function renderComponent(ComponentConstructor, props) {
  // 处理class组件
  if (ComponentConstructor.prototype && ComponentConstructor.prototype.render) {
    let instance = new ComponentConstructor(props);
    const vnode = instance.render();
    return _render(vnode);
  }
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
