import React, { SyntheticEvent } from 'react';
import { productStateTypeInternal, Product, DisplayedProduct, ProductTree } from '../reducers/types';
import cloneDeep from 'lodash/cloneDeep';
import style from './Products.css';
import { remote } from 'electron';
import XLSX from 'xlsx';
// @ts-ignore
import Nestable from 'react-nestable';
const shortid = require('shortid');

type Props = {
  categoryInput: (value: string) => void,
  createCategory: () => void,
  updateSchema: (value: ProductTree) => void,
  commitSchema: () => void,
  updateAndCommitSchema: (value: ProductTree) => void,
  loadFrom: (value: any) => void,
  products: productStateTypeInternal
}

type AccumulatorContainer = {
  i: number,
}

const styles: React.CSSProperties = {
  position: 'relative',
  padding: '10px 15px',
  border: '1px solid #666',
  borderRadius: '4px',
  background: '#444',
  cursor: 'pointer'
};

const replaceWithProduct = (products: Product[], schema: ProductTree, mut: DisplayedProduct[], accumulator: AccumulatorContainer) => {
  for (let i in schema) {
    accumulator.i++;
    if (schema.hasOwnProperty(i)) {
      let val = schema[i];
      if (typeof val === 'number') {
        mut.push({
          ...products[val],
          id: val,
          display: (products[val].display || products[val].name),
          name: '^' + products[val].name
        });
      } else {
        let newMut: DisplayedProduct[] = [];
        mut.push({
          name: i,
          id: "_" + accumulator.i,
          display: '(Kategooria) ' + i,
          children: newMut
        });
        replaceWithProduct(products, val as ProductTree, newMut, accumulator);
      }
    }
  }
};

const combineSchema = (products: Product[], schema: ProductTree) => {
  let mutableProducts: DisplayedProduct[] = [];
  let accumulator: AccumulatorContainer = {i: 0};
  replaceWithProduct(cloneDeep(products), cloneDeep(schema), mutableProducts, accumulator);
  return mutableProducts;
};

const renderItem = ({ item, collapseIcon }: { item: DisplayedProduct, collapseIcon: React.ReactElement }) => {
  return (
    <div style={styles}>
      {collapseIcon}
      {typeof item.id === 'number' ? <b>{item.display}</b> : item.display}
    </div>
  );
};

const confirmChange = ({}, targetParent: DisplayedProduct) => {
  return !targetParent || !(typeof targetParent.id === 'number');
};

export const safeSet = (object: any, key: string, value: any) => {
  if (object[key] === undefined) {
    object[key] = value;
  } else {
    object[key + "#" + shortid.generate()] = value;
  }
};

const replaceWithSchema = (products: DisplayedProduct[], mut: ProductTree) => {
  for (let i in products) {
    if (products.hasOwnProperty(i)) {
      let val = products[i];
      if (val.code !== undefined) {
        safeSet(mut, val.name, val.id as number);
      } else if (val.children !== undefined) {
        let newMut = {};
        safeSet(mut, val.name, newMut);
        replaceWithSchema(val.children, newMut);
      }
    }
  }
};

const clearEmpties = (o: {[vals: string]: any}) => {
  for (let k in o) {
    if (!o[k] || typeof o[k] !== "object") {
      continue // If null or not an object, skip to the next iteration
    }

    // The property is an object
    clearEmpties(o[k]); // <-- Make a recursive call on the nested object
    if (Object.keys(o[k]).length === 0) {
      delete o[k]; // The object had no properties, so delete that property
    }
  }
};

export default function Products(props: Props) {
  const {
    categoryInput,
    createCategory,
    updateSchema,
    updateAndCommitSchema,
    loadFrom,
    products,
  } = props;
  let displayProducts = combineSchema(products.products, products.schema);
  console.log(displayProducts);

  const applyChange = (newSchema: DisplayedProduct[]) => {
    let mutableSchema: ProductTree = {};
    replaceWithSchema(cloneDeep(newSchema), mutableSchema);
    console.log(mutableSchema);
    updateSchema(mutableSchema)
  };

  const testFileOpen = () => {
    remote.dialog.showOpenDialog({ properties: ['openFile'] }).then((o) => {
      if (!o.canceled && o.filePaths !== undefined) {
        let workbook = XLSX.readFile(o.filePaths[0]);
        let roa = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header:1});
        loadFrom(roa);
      }
    });
  };

  return (
    <>
      <div className={style.topBar}>
        /* FIXME first category add always fails */
        <form onSubmit={createCategory}>
          <div className={style.categoryInputContainer}>
            <input type="text" placeholder="Kategooria nimi..." value={products.newCategory}
                   onChange={(e: SyntheticEvent) => categoryInput((e.target as HTMLTextAreaElement).value)}
                   className={style.categoryInput}
            />
          </div>
          <input type="submit" value="Lisa kategooria"/>
        </form>
        {!products.upstream && <span className={style.warning}>Muudatused salvestamata!</span>}
        <input type="button" value="Salvesta muudatused" onClick={() => {
          let temporarySchema = cloneDeep(products.schema);
          clearEmpties(temporarySchema);
          updateAndCommitSchema(temporarySchema);
        }} className={style.commit}/>
        <input type="button" value="Lae sisse" onClick={testFileOpen}/>
      </div>
      <Nestable
        items={displayProducts}
        renderItem={renderItem}
        confirmChange={confirmChange}
        onChange={applyChange}
      />
    </>
  );
}
