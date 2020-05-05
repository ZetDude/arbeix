import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Menu.css';
import { menuStateTypeInternal } from '../reducers/types';
import { gt } from 'semver';
import axios from 'axios';
import { VERSION } from '../constants/version';

type Props = {
  setTab: (to: number) => void;
  setNamed: (to: string) => void;
  menu: menuStateTypeInternal
};

const API = 'https://api.github.com/repos/zetdude/arbeix/releases';

const checkUpdates = () => {
  axios.get(API).then((res) => {
    let latest = res.data[0];
    console.log(latest.name, ">", VERSION);
    if (gt(latest.name, VERSION)) {
      for (let i of latest.assets) {
        if (i.name.endsWith("dmg")) {
          alert(i.browser_download_url)
        }
      }
    }
  })
};


export default function Menu(props: Props) {
  const { setTab, menu } = props;

  return (
    <div className={styles.bar} data-tid="bar">
      {Object.entries(routes).map((j, i) => {
        let classname = styles.option;
        let keyname = j[0];
        if (keyname.startsWith("_")) {
          return;
        }
        if (menu.named === undefined && i === menu.tab) {
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
      {menu.named && <span
        className={`${styles.option} ${styles.named}`}
        >
          {menu.named}
      </span>}
      <a
        className={`fa fa-cloud-download-alt fa-2x ${styles.icon}`}
        onClick={checkUpdates}
      />
    </div>
  );
}
