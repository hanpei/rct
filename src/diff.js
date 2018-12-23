export const CREATE = 'CREATE';
export const REPLACE = 'REPLACE';
export const UPDATE = 'UPDATE';
export const REMOVE = 'REMOVE';

export const UPDATE_PROP = 'UPDATE_PROP';
export const REMOVE_PROP = 'REMOVE_PROP';

function diff(prevElement, nextElement, index = 0) {
  // prev === null
  if (isNull(prevElement)) {
    return { type: CREATE, nextElement, index };
  }

  // next === null
  if (isNull(nextElement)) {
    return { type: REMOVE, index };
  }

  // prev.type !== next.type
  if (!isSameElement(prevElement, nextElement)) {
    return { type: REPLACE, nextElement };
  } else {
    // console.log(prevElement, nextElement);
    return {
      type: UPDATE,
      children: diffChildren(prevElement, nextElement),
      props: diffProps(prevElement, nextElement),
    };
  }
}

function diffChildren(prev, next) {
  const patches = [];
  const len = Math.max(prev.props.children.length, next.props.children.length);
  for (let i = 0; i < len; i++) {
    patches[i] = diff(prev.props.children[i], next.props.children[i], i);
  }
  return patches;
}

function diffProps(prev, next) {
  const prevProps = prev.props;
  const nextProps = next.props;
  const allProps = Object.assign({}, prevProps, nextProps);
  const patches = [];

  Object.keys(allProps).forEach(key => {
    if (key === 'children') {
      return;
    }
    const prevPropValue = prevProps[key];
    const nextPropValue = nextProps[key];

    if (prevPropValue !== nextPropValue) {
      const patch = {
        type: UPDATE_PROP,
        prevProps: { [key]: prevPropValue },
        nextProps: { [key]: nextPropValue },
      };
      patches.push(patch);
    }

    if (nextPropValue === undefined || nextPropValue === null) {
      const patch = { type: REMOVE_PROP };
      patches.push(patch);
    }
  });

  return patches;
}

const isNull = element => element === undefined || element === null;
const isSameElement = (prev, next) =>
  typeof prev === 'object' &&
  typeof next === 'object' &&
  prev.type === next.type;
const isTextElement = elment => element.type === 'TEXT_ELEMENT';

export default diff;
