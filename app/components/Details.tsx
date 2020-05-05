import React from 'react';
import {
  useParams
} from 'react-router';
import {store} from '../reducers/types';

type Props = {
  details: {};
};

type Params = {
  product: string;
}

const getInfo = (productID: number) => {
  let products = store.get("products");
  let product = products[productID];
  let {name, code, unit, price} = product;
  return {name, code, unit, price};
};

export default function Menu(props: Props) {
  console.log(props);
  let {name, code, unit, price} = getInfo(parseInt(useParams<Params>().product));
  unit = unit || "tk";
  price = price || 0;
  return (
    <div>
      <h1>{name}</h1>
      <span>Tootekood <em>{code}</em></span>
      <p>{price/100} € {unit} kohta</p>
    </div>
  );
}
