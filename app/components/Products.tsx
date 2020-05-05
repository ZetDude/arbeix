import React, { SyntheticEvent } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { remote } from 'electron';
import XLSX from 'xlsx';
import routes from '../constants/routes.json';
// @ts-ignore
import Nestable from 'react-nestable';
import style from './Products.css';
import {
  productStateTypeInternal,
  Product,
  DisplayedProduct,
  ProductTree, store
} from '../reducers/types';
import { Link } from 'react-router-dom';
// import fs from 'fs';

type Props = {
  categoryInput: (value: string) => void;
  createCategory: () => void;
  updateSchema: (value: ProductTree) => void;
  commitSchema: () => void;
  updateAndCommitSchema: (value: ProductTree) => void;
  loadFrom: (value: any) => void;
  saveTo: (value: any) => void;
  setNamedMenu: () => void;
  products: productStateTypeInternal;
};

const styles: React.CSSProperties = {
  position: 'relative',
  padding: '10px 15px',
  border: '1px solid #666',
  borderRadius: '4px',
  background: '#444',
  cursor: 'pointer'
};

const replaceWithProduct = (
  products: Product[],
  schema: ProductTree,
  mut: DisplayedProduct[]
) => {
  for (const i in schema) {
    if (schema.hasOwnProperty(i)) {
      const val = schema[i];
      if (typeof val === 'number') {
        mut.push({
          ...products[val],
          id: val,
          display: products[val].display || products[val].name,
          name: `^${products[val].name}`
        });
      } else {
        const newMut: DisplayedProduct[] = [];
        let [name, hash] = i.split('#');
        mut.push({
          name: name,
          id: `_${hash}`,
          display: `(Kategooria) ${name}`,
          children: newMut
        });
        replaceWithProduct(products, val as ProductTree, newMut);
      }
    }
  }
};

const combineSchema = (products: Product[], schema: ProductTree) => {
  const mutableProducts: DisplayedProduct[] = [];
  replaceWithProduct(
    cloneDeep(products),
    cloneDeep(schema),
    mutableProducts
  );
  return mutableProducts;
};

const confirmChange = ({}, targetParent: DisplayedProduct) => {
  return !targetParent || !(typeof targetParent.id === 'number');
};

const replaceWithSchema = (products: DisplayedProduct[], mut: ProductTree) => {
  for (const i in products) {
    if (products.hasOwnProperty(i)) {
      const val = products[i];
      if (val.code !== undefined) {
        mut[val.name] = val.id as number;
      } else if (val.children !== undefined) {
        const newMut = {};
        mut[val.name + '#' + (val.id as string).slice(1)] = newMut;
        replaceWithSchema(val.children, newMut);
      }
    }
  }
};

const schemaToSpreadsheet = (products: Product[], schema: ProductTree, mut: any[][]) => {
  for (const [j, i] of products.entries()) {
    let productRow = [i.name, i.code, i.unit, (i.price === undefined ? undefined : i.price / 100)];
    let productPath = findVal(schema, j);
    productRow.push(...(productPath[1] as string[]));
    mut.push(productRow);
  }
  return mut;
};

const findVal = (object: any, val: any, path?: string[]): [string | undefined, string[]] => {
  let key: string | undefined = undefined;
  let fixPath = path !== undefined ? [...path] : [];
  Object.entries(object).some(function([k, v]) {
    if (v === val) {
      key = k;
      return true;
    }
    if (v && typeof v === 'object') {
      fixPath.push(k.split('#')[0]);
      [key, fixPath] = (findVal(v, val, fixPath));
      if (key === undefined) fixPath.pop();
      return key !== undefined;
    }
    return false;
  });
  return [key, fixPath];
};

const clearEmpties = (o: { [vals: string]: any }) => {
  for (const k in o) {
    if (!o[k] || typeof o[k] !== 'object') {
      continue; // If null or not an object, skip to the next iteration
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
    setNamedMenu,
    products
  } = props;
  const displayProducts = combineSchema(products.products, products.schema);
  console.log(displayProducts);

  const applyChange = (newSchema: DisplayedProduct[]) => {
    const mutableSchema: ProductTree = {};
    replaceWithSchema(cloneDeep(newSchema), mutableSchema);
    console.log(mutableSchema);
    updateSchema(mutableSchema);
  };

  const loadExternal = () => {
    const defaultPath = store.get('filePath', undefined);
    remote.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Tabel', extensions: ['ods', 'xlsx', 'xls'] }],
      defaultPath: defaultPath
    }).then(o => {
      if (!o.canceled && o.filePaths !== undefined && o.filePaths.length > 0) {
        store.set('filePath', o.filePaths[0]);
        const workbook = XLSX.readFile(o.filePaths[0]);
        const roa = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]],
          { header: 1 }
        );
        loadFrom(roa);
      }
    });
  };

  const saveExternal = (externalSchema: ProductTree) => {
    const defaultPath = store.get('filePath', undefined);
    remote.dialog.showSaveDialog({
      filters: [{ name: 'Tabel', extensions: ['ods', 'xls', 'xlsx'] }],
      defaultPath: defaultPath
    }).then(o => {
      if (!o.canceled && o.filePath !== undefined) {
        store.set('filePath', o.filePath);
        const roa = schemaToSpreadsheet(products.products, externalSchema, []);
        console.log(roa);
        const worksheet = XLSX.utils.json_to_sheet(
          roa, { skipHeader: true }
        );
        /*
        let wb = fs.existsSync(o.filePath) ? XLSX.readFile(o.filePath) : XLSX.utils.book_new();
        let nameCandidate = wb.SheetNames.length > 0 ? wb.SheetNames[0] : "Tooted";
        if (!wb.SheetNames.includes(nameCandidate)) wb.SheetNames.push(nameCandidate);
        wb.Sheets[nameCandidate] = worksheet;
        */
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, 'Tooted');
        XLSX.writeFile(wb, o.filePath, {});
      }
    });
  };

  const renderItem = ({
                        item,
                        collapseIcon
                      }: {
    item: DisplayedProduct;
    collapseIcon: React.ReactElement;
  }) => {
    let isProduct = typeof item.id === 'number';
    let detailLink = <Link
      to={routes._DETAIL + item.id.toString()}
      key={item.id.toString() + '_detail'}
      onClick={() => setNamedMenu()}
    >
      <i
        title="Detailid"
        className={`fa fa-edit ${style.icon}`}
      />
    </Link>;
    return (
      <div style={styles}>
        {isProduct ? detailLink : collapseIcon}
        {isProduct ? <b>{item.display}</b> : item.display}
      </div>
    );
  };

  return (
    /* FIXME first category add always fails */

    <div className={style.flexible + ' ' + style.bottomArea}>
      <div className={style.topBar}>
        <form>
          <div className={style.flexible}>
            <input
              type="text"
              placeholder="Kategooria nimi..."
              value={products.newCategory}
              onChange={(e: SyntheticEvent) =>
                categoryInput((e.target as HTMLTextAreaElement).value)
              }
              className={style.categoryInput}
            />
          </div>
          <i
            title="Lisa kategooria"
            className={`fa fa-folder-plus fa-2x`}
            onClick={createCategory}
          />
          {!products.upstream && (
            <span className={style.warning}>Muudatused salvestamata!</span>
          )}
          <i
            title="Salvesta muudatused"
            onClick={() => {
              const temporarySchema = cloneDeep(products.schema);
              clearEmpties(temporarySchema);
              saveExternal(temporarySchema);
              updateAndCommitSchema(temporarySchema);
            }}
            className={`fa fa-save fa-2x ${products.upstream ? '' : style.warning}`}
          />
          <i
            title="Lae sisse"
            onClick={loadExternal}
            className={`fa fa-file-import fa-2x`}
          />
        </form>
      </div>
      <Nestable
        items={displayProducts}
        renderItem={renderItem}
        confirmChange={confirmChange}
        onChange={applyChange}
      />
    </div>
  );
}
