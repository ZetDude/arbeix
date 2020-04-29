import { AnyAction } from 'redux';
import Store from 'electron-store';
import {
  defaultProductStateTypeInternal,
  productStateTypeInternal,
  ProductTree
} from './types';
import { COMMIT, INPUT, NEW, UPDATE, LOAD } from '../actions/products';
const shortid = require('shortid');

const yaml = require('js-yaml');

type TreeEntry = Tree | number;

interface Tree {
  [extraProps: string]: TreeEntry;
}

export const store = new Store({
  name: 'arbeix-persistent',
  fileExtension: 'yaml',
  serialize: yaml.safeDump,
  deserialize: yaml.safeLoad
});

const failSet = (
  object: any,
  key: string,
  value: any,
  orElse: (obj: any) => void
) => {
  if (object[key] === undefined) {
    object[key] = value;
  } else {
    orElse(object[key]);
  }
};

const hashFind = (iter: any, key: string) => {
  for (let i in iter) {
    if (iter.hasOwnProperty(i) && i.split("#")[0] === key) {
      return i;
    }
  }
  return false;
};

export default function entries(
  state: productStateTypeInternal,
  action: AnyAction
): productStateTypeInternal {
  if (state === undefined) {
    const persistent = store.get('schema') && store.get('products');
    return persistent
      ? {
          ...defaultProductStateTypeInternal,
          schema: store.get('schema'),
          products: store.get('products')
        }
      : {
          ...defaultProductStateTypeInternal
        };
  }

  const workbookToSchema = (roa: any[][]) => {
    const newSchema: ProductTree = {};
    const newProducts = [];
    for (const [accumulator, i] of roa.entries()) {
      const [name, code, unit, price, ...category] = i;
      newProducts.push({
        name, unit, price: ~~(price * 100),
        code: code.toString()
      });

      let traverse = newSchema;
      const fullName = [...category, name];

      for (const [index, value] of fullName.entries()) {
        const isFinal = index === category.length;

        if (isFinal) {
          failSet(traverse, `^${value}`, accumulator, () => {
            throw 'Invalid XLSX schema. (2)';
          });
        } else {
          let hashVal = hashFind(traverse, value) || `${value}#${shortid.generate()}`;
          failSet(traverse, hashVal, {}, x => {
            if (typeof x === 'number') throw 'Invalid XLSX schema. (1)';
          });
          traverse = traverse[hashVal] as ProductTree;
        }
      }
    }

    return { newSchema, newProducts };
  };

  switch (action.type) {
    case INPUT:
      return {
        ...state,
        newCategory: action.value
      };
    case NEW:
      state.schema[`${state.newCategory}#${shortid.generate()}`] = {};
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
      store.set('products', state.products);
      return {
        ...state,
        upstream: true
      };
    case LOAD:
      const { newSchema, newProducts } = workbookToSchema(action.value);
      return {
        ...state,
        schema: newSchema,
        products: newProducts
      };
    default:
      return state;
  }
}
