import Component from './component';
import diff from './diff';
import patch from './patch';

function instantiate(element) {
  const elementType = getElementType(element);
  if (elementType === 'EMPTY_ELEMENT') {
    return new EmptyComponent();
  }
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

class EmptyComponent {
  constructor() {
    this.currentElement = '';
    this.dom = null;
  }
  mount() {
    const text = this.currentElement;
    this.dom = document.createTextNode(text);
    return this.dom;
  }
}

class TextComponent {
  constructor(element) {
    this.currentElement = element;
    this.dom = null;
  }
  mount() {
    const text = this.currentElement.props.nodeValue;
    this.dom = document.createTextNode(text);
    return this.dom;
  }
  /*
  update(nextElement) {
    const text = nextElement.props.nodeValue;
    if (this.dom.nodeValue !== text) {
      this.dom.nodeValue = text;
    }
  }
  */
  getDom() {
    return this.dom;
  }
  setDom(newDom) {
    this.dom = newDom;
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

    const childElements = props.children;
    this.childInstances = childElements.map(instantiate);
    this.childInstances
      .map(childInstance => childInstance.mount())
      .forEach(childDom => this.dom.appendChild(childDom));
    return this.dom;
  }
  update(nextElement) {
    const prevProps = this.currentElement.props;
    const nextProps = nextElement.props;

    // removeDomProps(this.dom, prevProps);
    // setDomProps(this.dom, nextProps);
    updateDomProps(this.dom, prevProps, nextProps);

    const prevChildElements = prevProps.children || [];
    const nextChildElements = nextProps.children || [];
    this.updateChildren(prevChildElements, nextChildElements, nextElement);
  }
  /*
  updateChildren(prev, next, nextElement) {
    const prevChildElements = prev;
    const nextChildElements = next;
    const prevChildInstances = this.childInstances;
    const nextChildInstances = [];
    const len = Math.max(prevChildElements.length, nextChildElements.length);

    for (let i = 0; i < len; i++) {
      const prevChildElement = prevChildElements[i];
      const nextChildElement = nextChildElements[i];

      if (prevChildElement === undefined) {
        // add
        const nextChildInstance = instantiate(nextChildElement);
        nextChildInstances.push(nextChildInstance);
        const childDom = nextChildInstance.mount();
        this.dom.appendChild(childDom);
      } else if (nextChildElement === undefined) {
        // remove
        const prevChildInstance = prevChildInstances[i];
        const childDom = prevChildInstance.getDom();
        this.dom.removeChild(childDom);
      } else if (
        prevChildElement.type &&
        prevChildElement.type === nextChildElement.type
      ) {
        // update
        const childInstance = prevChildInstances[i];
        nextChildInstances.push(childInstance);
        childInstance.update(nextChildElement);
      } else {
        // replace
        const prevChildInstance = prevChildInstances[i];
        const nextChildInstance = instantiate(nextChildElement);
        nextChildInstances.push(nextChildInstance);
        const nextChildDom = nextChildInstance.mount();
        const prevChildDom = prevChildInstance.getDom();
        this.dom.replaceChild(nextChildDom, prevChildDom);
      }
    }

    this.currentElement = nextElement;
    this.childInstances = nextChildInstances;
  }
  */
  getDom() {
    return this.dom;
  }
  setDom(newDom) {
    this.dom = newDom;
  }
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

    console.log(this.renderedInstance.getDom());

    const prevRenderedElement = this.renderedInstance.currentElement;
    const nextRenderedElement = this.publicInstance.render();
    console.log(prevRenderedElement, nextRenderedElement);
    const dom = this.getDom();
    const patches = diff(prevRenderedElement, nextRenderedElement);
    console.log(patches);

    patch(dom.parentNode, patches);
    this.renderedInstance = instantiate(nextRenderedElement);
    // console.log(this.renderedInstance);
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
  console.log(allProps);
  Object.keys(allProps).forEach(key => {
    const prevPropValue = prevProps[key];
    const nextPropValue = nextProps[key];

    if (key === 'children') {
      return;
    }
    if (key === 'style') {
      console.log(prevPropValue);
      console.log(nextPropValue);

      for (const styleName in nextPropValue) {
        dom.style[styleName] = nextPropValue[styleName];
      }

      return;
    }

    // console.log(prevPropValue);
    // console.log(nextPropValue);
    // console.log(nextPropValue === prevPropValue);

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
