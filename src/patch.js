export const CREATE = 'CREATE';
export const REPLACE = 'REPLACE';
export const UPDATE = 'UPDATE';
export const REMOVE = 'REMOVE';

export const UPDATE_PROP = 'UPDATE_PROP';
export const REMOVE_PROP = 'REMOVE_PROP';

import instantiate, {
  setDomProps,
  removeDomProps,
  updateDomProps,
} from './instance';

export default function patch(parent, patches, index = 0) {
  console.group('parentDom and patch');
  console.log('childNodes index', index);
  console.log(parent);
  console.log(patches);
  console.groupEnd();

  if (!patches) {
    return;
  }

  const el = parent.childNodes[index];

  switch (patches.type) {
    case CREATE: {
      const { nextElement, index } = patches;
      const instance = instantiate(nextElement);
      const dom = instance.mount();
      const referenceNode = parent.childNodes[index];
      parent.insertBefore(dom, referenceNode);
      break;
    }

    case REMOVE: {
      const { index } = patches;
      const referenceNode = parent.childNodes[index];
      parent.removeChild(referenceNode);
      break;
    }
    case REPLACE: {
      const { nextElement } = patches;
      const nextInstance = instantiate(nextElement);
      const dom = nextInstance.mount();
      console.log(dom);
      parent.replaceChild(dom, el);
      break;
    }

    case UPDATE: {
      const { props, children } = patches;

      for (let i = 0; i < children.length; i++) {
        const childPatches = children[i];
        patch(el, childPatches, i);
      }

      for (let j = 0; j < props.length; j++) {
        const propPatches = props[j];
        patchProps(el, propPatches);
      }

      break;
    }

    default:
      break;
  }
}
function patchProps(el, patches, index) {
  switch (patches.type) {
    case UPDATE_PROP: {
      const { prevProps, nextProps } = patches;
      updateDomProps(el, prevProps, nextProps);
      break;
    }
    case REMOVE_PROP: {
      removeDomProps(el, nextProps);
    }
    default:
      break;
  }
}
