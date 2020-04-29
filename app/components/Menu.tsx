import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Menu.css';

type Props = {
  setTab: (to: number) => void;
  menu: number;
};

export default function Menu(props: Props) {
  const { setTab, menu } = props;

  return (
    <div className={styles.bar} data-tid="bar">
      {Object.entries(routes).map((j, i) => {
        let classname = styles.option;
        let keyname = j[0];
        if (i === menu) {
          classname += ` ${styles.active}`;
        }
        return (
          <Link
            className={classname}
            to={j[1]}
            key={keyname}
            onClick={() => setTab(i)}
          >
            {j[0]}
          </Link>
        );
      })}
    </div>
  );
}
