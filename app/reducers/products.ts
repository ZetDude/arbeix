import { defaultProductStateTypeInternal, productStateTypeInternal } from './types';
import { AnyAction } from 'redux';
import { COMMIT, INPUT, NEW, UPDATE } from '../actions/products';
import { safeSet } from '../components/Products';
import Store from 'electron-store';
const yaml = require('js-yaml');

type TreeEntry = Tree | number

interface Tree {
  [extraProps: string]: TreeEntry
}

export const store = new Store({
  name: 'arbeix-persistent',
  fileExtension: 'yaml',
  serialize: yaml.safeDump,
  deserialize: yaml.safeLoad
});

export default function entries(state: productStateTypeInternal, action: AnyAction): productStateTypeInternal {
  if (state === undefined) {
    let persistent = store.get('schema');
    return persistent ? {
      ...defaultProductStateTypeInternal,
      schema: persistent,
    } : {
      ...defaultProductStateTypeInternal
    };
  }

  switch (action.type) {
    case INPUT:
      return {
        ...state,
        newCategory: action.value
      };
    case NEW:
      safeSet(state.schema, state.newCategory, {});
      return {
        ...state,
        newCategory: ''
      };
    case UPDATE:
      return {
        ...state,
        upstream: false,
        schema: action.value
      };
    case COMMIT:
      store.set('schema', state.schema);
      return {
        ...state,
        upstream: true,
      };
    default:
      return state;
  }
}
