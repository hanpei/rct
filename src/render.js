import Compoent from './component'

function render(vnode, container) {
  return container.appendChild(_render(vnode));
}

function _render(vnode) {
  console.log(vnode);
  // null or undefined
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
    vnode = '';
  }

  // text
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return renderTextNode(vnode);
  }

  // dom
  if (typeof vnode.type === 'string') {
    return renderDomNode(vnode)
  }

  // component
  if (typeof vnode.type === 'function') {
    return renderComponent(vnode.type, vnode.props);
  }
}

function renderTextNode(vnode) {
  const textNode = document.createTextNode(String(vnode));
  return textNode;
}

function renderDomNode(vnode) {
  const dom = document.createElement(vnode.type);
  setAttrbutes(dom, vnode.props);
  if (typeof vnode.props.children === 'string') {
    render(vnode.props.children, dom);
  } else {
    vnode.props.children &&
      vnode.props.children.forEach(child => render(child, dom));
  }
  return dom;
}

function renderComponent(ComponentConstructor, props) {
  if (ComponentConstructor.prototype && ComponentConstructor.prototype.render) {
    // 处理class组件
    let instance = new ComponentConstructor(props);
    const vnode = instance.render();
    return _render(vnode);
  } else {
    // 处理functional组件
    let instance = new Compoent(props)
    console.log('=============================');
    instance.render = function() {
      return ComponentConstructor(props)
    }
    return _render(instance.render())
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
