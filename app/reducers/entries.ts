import { AnyAction } from 'redux';
import { INDENT, DEDENT } from '../actions/entries';
import { COMMIT } from '../actions/products';
import { defaultEntryStateTypeInternal, entryStateTypeInternal, ProductEntry, ProductTree } from './types';
import cloneDeep from 'lodash/cloneDeep';
import { store } from './products';

export default function entries(state: entryStateTypeInternal, action: AnyAction): entryStateTypeInternal {
  function nextOptions(tree: ProductTree, path: string[], returnKeys = true) {
    let traverse: ProductEntry = cloneDeep(tree);
    for (const i of path) {
      traverse = (traverse as ProductTree)[i];
    }

    return returnKeys ? Object.keys(traverse) : (traverse as number)
  }

  if (state === undefined) {
    let tree = store.get('schema') || defaultEntryStateTypeInternal.tree;
    return {
      ...defaultEntryStateTypeInternal,
      tree: tree,
      options: (nextOptions(tree, []) as string[])
    };
  }

  if (action.type === INDENT) {
    let newPath = [...state.path, action.pathAddition];
    let newOptions = (nextOptions(state.tree, newPath) as string[]);
    return {
      ...state,
      path: newPath,
      options: newOptions,
      final: newOptions.length === 0 ? [newPath.slice(-1)[0], (nextOptions(state.tree, newPath, false) as number)] : undefined
    };
  } else if (action.type === DEDENT) {
    let dedentedPath = [...state.path].slice(0, -1);
    return {
      ...state,
      path: dedentedPath,
      options: (nextOptions(state.tree, dedentedPath) as string[]),
      final: undefined
    };
  } else if (action.type === COMMIT) {
    let path = defaultEntryStateTypeInternal.path;
    let tree = store.get('schema') || defaultEntryStateTypeInternal.tree;
    let newOptions = (nextOptions(tree, path) as string[]);
    return {
      ...defaultEntryStateTypeInternal,
      tree: tree,
      options: newOptions,
    };
  } else {
    return state;
  }
}
