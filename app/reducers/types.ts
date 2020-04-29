import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type counterStateType = {
  counter: number;
};

export type entryStateTypeInternal = {
  path: string[];
  options: string[];
  tree: ProductTree;
  final: [string, number] | undefined;
};

export const defaultEntryStateTypeInternal: entryStateTypeInternal = {
  path: [],
  options: [],
  tree: {},
  final: undefined
};

export type Product = {
  name: string;
  code: string;
  unit?: string;
  price?: number;
  display?: string;
};
export type DisplayedProduct = {
  name: string;
  display: string;
  id: number | string;
  code?: string;
  children?: DisplayedProduct[];
};
export type ProductEntry = ProductTree | Product | number;

export type ProductTree = {
  [key: string]: ProductEntry;
};

export type productStateTypeInternal = {
  products: Product[];
  schema: ProductTree;
  newCategory: string;
  upstream: boolean;
};

export const defaultProductStateTypeInternal: productStateTypeInternal = {
  products: [
    { name: 'VIGA', code: '1' },
  ],
  schema: {
    'VIGA': 0,
  },
  newCategory: '',
  upstream: true
};

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<counterStateType, Action<string>>;
