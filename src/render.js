import Component from './component';

function render(vnode, container) {
  return _render(vnode, container);
}

export function _render(vnode, container, isUpdate = false) {
  // console.log(vnode);
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
    console.log('------');

    domNode = renderDomNode(vnode, container);
  }

  // component
  if (typeof vnode.type === 'function') {
    domNode = mountComponent(vnode, container);
  }

  if (isUpdate) {
    console.log('container.parent', container.parentNode);
    console.log('container', container);
    console.log('prev', vnode._hostNode);
    console.log('next', domNode);
    const p = container.parentNode;
    console.log(p);
    if (p) {
      p.removeChild(vnode._hostNode);
      p.appendChild(domNode);
    } else {
      console.log(container.parentNode);
    }

  } else {
    container.appendChild(domNode);
  }

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
  vnode.dom = dom
  return dom;
}

function mountComponent(vnode, parentNode) {
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
  const renderedVnode = instance.render();
  if (!renderedVnode) console.warn('你可能忘记在组件render()方法中返回jsx了');
  const domNode = _render(renderedVnode, parentNode);

  instance.vnode = renderedVnode;
  instance.dom = domNode;
  instance.vnode._hostNode = domNode;

  return domNode;
}

function setAttrbutes(dom, props) {
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
