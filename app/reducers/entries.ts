import { AnyAction } from 'redux';
import cloneDeep from 'lodash/cloneDeep';
import { INDENT, DEDENT } from '../actions/entries';
import { COMMIT } from '../actions/products';
import {
  defaultEntryStateTypeInternal,
  entryStateTypeInternal,
  ProductEntry,
  ProductTree
} from './types';
import { store } from './products';

export default function entries(
  state: entryStateTypeInternal,
  action: AnyAction
): entryStateTypeInternal {
  function nextOptions(tree: ProductTree, path: string[], returnKeys = true) {
    let traverse: ProductEntry = cloneDeep(tree);
    for (const i of path) {
      traverse = (traverse as ProductTree)[i];
    }

    return returnKeys ? Object.keys(traverse) : (traverse as number);
  }

  if (state === undefined) {
    const tree = store.get('schema') || defaultEntryStateTypeInternal.tree;
    return {
      ...defaultEntryStateTypeInternal,
      tree,
      options: nextOptions(tree, []) as string[]
    };
  }

  if (action.type === INDENT) {
    const newPath = [...state.path, action.pathAddition];
    const newOptions = nextOptions(state.tree, newPath) as string[];
    return {
      ...state,
      path: newPath,
      options: newOptions,
      final:
        newOptions.length === 0
          ? [
              newPath.slice(-1)[0],
              nextOptions(state.tree, newPath, false) as number
            ]
          : undefined
    };
  }
  if (action.type === DEDENT) {
    const dedentedPath = [...state.path].slice(0, -1);
    return {
      ...state,
      path: dedentedPath,
      options: nextOptions(state.tree, dedentedPath) as string[],
      final: undefined
    };
  }
  if (action.type === COMMIT) {
    const { path } = defaultEntryStateTypeInternal;
    const tree = store.get('schema') || defaultEntryStateTypeInternal.tree;
    const newOptions = nextOptions(tree, path) as string[];
    return {
      ...defaultEntryStateTypeInternal,
      tree,
      options: newOptions
    };
  }
  return state;
}
