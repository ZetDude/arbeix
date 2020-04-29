import { Dispatch, ProductTree } from '../reducers/types';

export const INPUT = 'CATEGORY_INPUT';
export const NEW = 'NEW_CATEGORY';
export const UPDATE = 'UPDATE_SCHEMA';
export const COMMIT = 'COMMIT_SCHEMA';
export const LOAD = 'LOAD_XLSX';
export const SAVE = 'SAVE_XLSX';

export function categoryInput(to: string) {
  return {
    type: INPUT,
    value: to
  };
}

export function createCategory() {
  return {
    type: NEW
  };
}

export function updateSchema(to: ProductTree) {
  return {
    type: UPDATE,
    value: to
  };
}

export function commitSchema() {
  return {
    type: COMMIT
  };
}

export function updateAndCommitSchema(to: ProductTree) {
  return (dispatch: Dispatch) => {
    dispatch(updateSchema(to));
    dispatch(commitSchema());
  };
}

export function loadFrom(external: any) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: LOAD,
      value: external
    });
    dispatch(commitSchema());
  };
}

export function saveTo(external: any) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: SAVE,
      value: external
    });
    dispatch(commitSchema());
  }
}
