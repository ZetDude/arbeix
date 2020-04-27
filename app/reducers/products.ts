import { defaultProductStateTypeInternal, productStateTypeInternal, ProductTree } from './types';
import { AnyAction } from 'redux';
import { COMMIT, INPUT, NEW, UPDATE, LOAD } from '../actions/products';
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

const failSet = (object: any, key: string, value: any, orElse: (obj: any) => void) => {
  if (object[key] === undefined) {
    object[key] = value;
  } else {
    orElse(object[key]);
  }
};

export default function entries(state: productStateTypeInternal, action: AnyAction): productStateTypeInternal {
  if (state === undefined) {
    let persistent = store.get('schema') && store.get('products');
    return persistent ? {
      ...defaultProductStateTypeInternal,
      schema: store.get('schema'),
      products: store.get('products'),
    } : {
      ...defaultProductStateTypeInternal
    };
  }

  const workbookToSchema = (roa: any[][]) => {
    let newSchema: ProductTree = {};
    let newProducts = [];
    for (let [accumulator, i] of roa.entries()) {
      let [name, code, {}, {}, ...category] = i;
      newProducts.push({
        name: name,
        code: code.toString(),
      });

      let traverse = newSchema;
      let fullName = [...category, name];

      for (let [index, value] of fullName.entries()) {
        const isFinal = index === category.length;

        if (isFinal) {
          failSet(traverse, "^" + value, accumulator, () => { throw "Invalid XLSX schema. (2)" });
        } else {
          failSet(traverse, value, {}, (x) => { if (typeof x === "number") throw "Invalid XLSX schema. (1)" });
          traverse = (traverse[value] as ProductTree);
        }
      }
    }

    return {newSchema, newProducts};
  };

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
      store.set('products', state.products);
      return {
        ...state,
        upstream: true,
      };
    case LOAD:
      let {newSchema, newProducts} = workbookToSchema(action.value);
      return {
        ...state,
        schema: newSchema,
        products: newProducts,
      };
    default:
      return state;
  }
}
