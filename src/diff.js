export const CREATE = 'CREATE';
export const REPLACE = 'REPLACE';
export const UPDATE = 'UPDATE';
export const REMOVE = 'REMOVE';

export const SET_PROP = 'SET_PROP';
export const REMOVE_PROP = 'REMOVE_PROP';

function diff(prevElement, nextElement) {
  // prev === null
  if (isNull(prevElement)) {
    return { type: CREATE, nextElement };
  }

  // next === null
  if (isNull(nextElement)) {
    return { type: REMOVE };
  }

  // prev.type !== next.type
  if (!isSameElement(prevElement, nextElement)) {
    return { type: REPLACE, prevElement };
  } else {
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
    patches[i] = diff(prev.props.children[i], next.props.children[i]);
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
      const patch = { type: SET_PROP, key, value: nextPropValue };
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

export default diff;

function patch(patches) {
  if (!patches) {
    return;
  }
}
