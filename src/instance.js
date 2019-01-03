import Component from './component';
import diff from './diff';
import patch from './patch';

function instantiate(element) {
  const elementType = getElementType(element);
  if (elementType === 'TEXT_ELEMENT') {
    const instance = createTextElement(element);
    return instance;
  }
  if (elementType === 'DOM_ELEMENT') {
    const instance = createDomElement(element);
    return instance;
  }
  if (elementType === 'COMPONENT_ELEMENT') {
    const instance = createCompositeComponent(element);
    return instance;
  }
}

function createTextElement(element) {
  const text = element.props.nodeValue;
  const dom = document.createTextNode(text);
  const instance = { dom, element };
  return instance;
}

function createDomElement(element) {
  const { type, props } = element;
  const dom = document.createElement(type);
  setDomProps(dom, props);
  const childElements = props.children;
  const childInstances = childElements.map(instantiate);
  childInstances
    .filter(c => c !== undefined)
    .map(instance => instance.dom)
    .forEach(childDom => dom.appendChild(childDom));

  const instance = { element, dom };
  return instance;
}

function createCompositeComponent(element) {
  const { type: ComponentCtor, props } = element;
  let publicInstance;
  if (ComponentCtor.prototype && ComponentCtor.prototype.render) {
    publicInstance = new ComponentCtor(props);
  } else {
    publicInstance = new Component(props);
    publicInstance.constructor = ComponentCtor;
    publicInstance.render = function() {
      return this.constructor(props);
    };
  }
  const renderedElement = publicInstance.render();
  const renderedInstance = instantiate(renderedElement);
  const dom = renderedInstance.dom;
  const instance = { element: renderedElement,publicInstance, renderedInstance, dom };
  publicInstance.__internalInstance = instance;
  return instance;
}

class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.publicInstance = null;
    this.renderedInstance = null;
  }
  mount() {
    const { type: ComponentCtor, props } = this.currentElement;
    if (ComponentCtor.prototype && ComponentCtor.prototype.render) {
      this.publicInstance = new ComponentCtor(props);
    } else {
      this.publicInstance = new Component(props);
      this.publicInstance.constructor = ComponentCtor;
      this.publicInstance.render = function() {
        return this.constructor(props);
      };
    }
    this.publicInstance.__updater = this.update.bind(this);
    const renderedElement = this.publicInstance.render();
    this.renderedInstance = instantiate(renderedElement);
    return this.renderedInstance.mount();
  }
  update(nextElement) {
    this.currentElement = nextElement || this.currentElement;
    const { props } = this.currentElement;
    this.publicInstance.props = props;

    const prevRenderedElement = this.renderedInstance.currentElement;
    const nextRenderedElement = this.publicInstance.render();
    const dom = this.getDom();
    const patches = diff(prevRenderedElement, nextRenderedElement);
    console.log(patches);

    patch(dom.parentNode, patches);
    this.renderedInstance = instantiate(nextRenderedElement);
    this.renderedInstance.setDom(dom);
  }
  getDom() {
    return this.renderedInstance.getDom();
  }
}

export function setDomProps(dom, props) {
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

export function removeDomProps(dom, props) {
  for (const propName in props) {
    if (props.hasOwnProperty(propName)) {
      if (propName === 'children') {
        continue;
      } else if (propName === 'style') {
        dom.style = null;
      } else if (isEvent(propName)) {
        const eventType = propName.substr(2).toLowerCase();
        const enventHandler = props[propName];
        dom.removeEventListener(eventType, enventHandler);
      } else {
        dom[propName] = null;
      }
    }
  }
}

export function updateDomProps(dom, prevProps, nextProps) {
  const allProps = Object.assign({}, prevProps, nextProps);
  Object.keys(allProps).forEach(key => {
    const prevPropValue = prevProps[key];
    const nextPropValue = nextProps[key];

    if (key === 'children') {
      return;
    }
    if (key === 'style') {
      for (const styleName in nextPropValue) {
        dom.style[styleName] = nextPropValue[styleName];
      }
      return;
    }

    if (prevPropValue !== nextPropValue) {
      dom[key] = nextPropValue;
    }
    if (nextPropValue === undefined || nextPropValue === null) {
      dom[key] = nextPropValue;
    }
  });
}

function getElementType(element) {
  // text
  if (element === null || element === undefined) {
    return 'EMPTY_ELEMENT';
  }
  if (element.type === 'TEXT_ELEMENT') {
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
