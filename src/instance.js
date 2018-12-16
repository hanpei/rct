import Component from './component';

function instantiate(element) {
  console.log(element);
  const elementType = getElementType(element);
  if (elementType === 'TEXT_ELEMENT') {
    const instance = new TextComponent(element);
    return instance;
  }
  if (elementType === 'DOM_ELEMENT') {
    const instance = new DomComponent(element);
    return instance;
  }
  if (elementType === 'COMPONENT_ELEMENT') {
    const instance = new CompositeComponent(element);
    return instance;
  }
}

class TextComponent {
  constructor(element) {
    this.currentElement = element;
    this.dom = null;
  }
  mount() {
    this.dom = document.createTextNode(this.currentElement);
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

    const childElements = props.children;
    this.childInstances = childElements.map(instantiate);
    const childDoms = this.childInstances.map(childInstance =>
      childInstance.mount()
    );
    childDoms.forEach(childDom => this.dom.appendChild(childDom));
    setDomProps(this.dom, props);
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
        return this.constructor(props)
      };
    }
    const childElement = this.publicInstance.render();
    this.childInstance = instantiate(childElement);
    return this.childInstance.mount();
  }
}

function setDomProps(dom, props) {
  for (const propName in props) {
    if (props.hasOwnProperty(propName)) {
      if (propName === 'children') {
        continue;
      } else if (propName === 'style') {
        const styles = props[propName];
        for (const styleName in styles) {
          dom.style[styleName] = styles[styleName];
        }
      } else if (isEvent(propName)) {
        const eventType = propName.substr(2).toLowerCase();
        const enventHandler = props[propName];
        dom.addEventListener(eventType, enventHandler, false);
      } else {
        const prop = props[propName];
        dom[propName] = prop;
      }
    }
  }
}

function getElementType(element) {
  // text
  if (typeof element === 'string' || typeof element === 'number') {
    return 'TEXT_ELEMENT';
  } else if (typeof element === 'object') {
    const { type, props } = element;
    if (typeof type === 'string') {
      // dom
      return 'DOM_ELEMENT';
    } else if (typeof type === 'function') {
      // component
      return 'COMPONENT_ELEMENT';
    } else {
      console.log('something wrong with element', element);
    }
  } else {
    console.log('something wrong with element', element);
  }
}

function isEvent(propName) {
  return propName.startsWith('on');
}

export default instantiate;
