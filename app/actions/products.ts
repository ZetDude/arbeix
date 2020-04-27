import { ProductTree } from '../reducers/types';

export const INPUT = "CATEGORY_INPUT";
export const NEW = "NEW_CATEGORY";
export const UPDATE = "UPDATE_SCHEMA";
export const COMMIT = "COMMIT_SCHEMA";

export function categoryInput(to: string) {
  return {
    type: INPUT,
    value: to,
  }
}

export function createCategory() {
  return {
    type: NEW,
  }
}

export function updateSchema(to: ProductTree) {
  return {
    type: UPDATE,
    value: to,
  }
}

export function commitSchema() {
  return {
    type: COMMIT,
  }
}
