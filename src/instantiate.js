import Component from './component';
import { _render } from './render';

export  function instantiate(element) {
  // console.log(element);
  const { type, props } = element;
  const isEmptyNode =
    element === undefined || element === null || element.length === 0;
  const isTextNode = type === 'TEXT_ELEMENT';
  const isDomNode =
    typeof element === 'object' && typeof element.type === 'string';
  const isComponentNode =
    typeof element === 'object' && typeof element.type === 'function';

  // empty
  if (isEmptyNode) {
    // console.log('isEmptyNode');
    const instance = new TextComponent({ props: { nodeValue: '' } });
    return instance;
  }

  // text
  if (isTextNode) {
    // console.log('isTextNode');
    const instance = new TextComponent(element);
    return instance;
  }

  // dom
  if (isDomNode) {
    const instance = new DomComponent(element);
    return instance;
  }

  // component
  if (isComponentNode) {
    const instance = new CompositeComponent(element);
    return instance;
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

class TextComponent {
  constructor(element) {
    this.currentElement = element;
    this.dom = null;
  }
  mount() {
    const nodeValue = this.currentElement.props.nodeValue;
    this.dom = document.createTextNode(nodeValue);
    // console.log(this.dom);
    return this.dom;
  }
}

class DomComponent {
  constructor(element) {
    this.currentElement = element;
    this.childInstances = null;
    this.dom = null;
  }
  mount() {
    const { type, props } = this.currentElement;
    this.dom = document.createElement(type);
    setDomProps(this.dom, props);

    const hasChildren = props.hasOwnProperty('children');
    // console.log(this.currentElement);
    if (hasChildren) {
      const childElements = props.children || [];
      this.childInstances = childElements.map(child => instantiate(child));
      this.childInstances
        .map(childInstance => childInstance.mount())
        .forEach(childDom => this.dom.appendChild(childDom));
    }

    return this.dom;
  }
}

class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.publicInstance = null;
    this.childInstance = null;
  }
  mount() {
    const { type: ComponentCtor, props } = this.currentElement;

    if (ComponentCtor.prototype && ComponentCtor.prototype.render) {
      this.publicInstance = new ComponentCtor(props);
    } else {
      this.publicInstance = new Component(props);
      this.publicInstance.constructor = ComponentCtor;
      this.publicInstance.render = function() {
        return ComponentCtor(props);
      };
    }

    const childElement = this.publicInstance.render();
    // 暂不支持Component.render 返回数组[]
    this.childInstance = instantiate(childElement);
    return this.childInstance.mount();
  }
}
