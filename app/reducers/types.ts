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
    { name: 'Toode', code: '1' },
    { name: 'Muu toode', code: '2' },
    { name: 'Toode', code: '3' }
  ],
  schema: {
    'Asjad 1': { Alamkategooria: { 'Muu toode': 1 }, Toode: 0 },
    'Asjad 2': { Toode: 2 }
  },
  newCategory: '',
  upstream: true
};

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<counterStateType, Action<string>>;
