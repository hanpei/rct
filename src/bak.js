/**
 * 生成组件实例
 * @param {ReactElement|string|number|false|null} vnode
 */
function _getInstance(vnode) {
  // console.log(vnode);
  let instance = null;

  if (vnode === undefined || vnode === null) {
    // console.log('EmptyNodeComponent');
    instance = new EmptyNodeComponent();
  }
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    // console.log('TextNodeComponent');
    instance = new TextNodeComponent(vnode);
  }
  if (typeof vnode === 'object' && !!vnode) {
    const { type, props } = vnode;
    if (typeof type === 'string') {
      // console.log('DomDodeComponent');
      instance = new DomDodeComponent(vnode);
    } else if (typeof type === 'function') {
      instance = new CompositeComponent(vnode);
    } else {
      throw new Error(`something wrong with vnode type: ${vnode.type}`);
    }
  }
  return instance;
}




class EmptyNodeComponent {
  constructor() {
    this.vnode = null;
  }
  mountComponent() {
    return '';
  }
}

class TextNodeComponent {
  constructor(str) {
    this.vnode = str;
  }
  mountComponent() {
    const textNode = document.createTextNode(this.vnode);
    return textNode;
  }
}

class DomDodeComponent {
  constructor(vnode) {
    this.vnode = vnode;
  }
  mountComponent() {
    const { type, props } = this.vnode;
    const dom = document.createElement(type);
    setAttrbutes(dom, props);
    let children = props.children;
    if (typeof props.children === 'string') {
      children = [props.children];
    }

    children.forEach(child => render(child, dom));
    return dom;
  }
}

class CompositeComponent {
  constructor(vnode) {
    this.vnode = vnode;
  }
  mountComponent() {
    const { type: ComponentConstructor, props } = this.vnode;
    let instance;
    if (
      ComponentConstructor.prototype &&
      ComponentConstructor.prototype.render
    ) {
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
    const renderdInstance = _getInstance(renderedVnode);
    const renderdResult = renderdInstance.mountComponent(props);
    return renderdResult;
  }
}