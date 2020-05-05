import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Menu.css';
import { menuStateTypeInternal } from '../reducers/types';
import { gt } from 'semver';
import axios from 'axios';
import { VERSION, fromSemVer, _VERSION } from '../constants/version';
import { remote } from 'electron';
import { UpdateAvailable, UpdateChecking, UpdateIdle } from '../actions/menu';

type Props = {
  setTab: (to: number) => void;
  setNamed: (to: string) => void;
  autoUpdateState: (to: number) => void;
  menu: menuStateTypeInternal
};

const API = 'https://api.github.com/repos/zetdude/arbeix/releases';


export default function Menu(props: Props) {
  const { setTab, autoUpdateState, menu } = props;
  const confirmUpdate = (available: string, url: string) => {
    autoUpdateState(UpdateAvailable);
    remote.dialog.showMessageBox({
      type: 'question',
      buttons: ['Ei', 'Jah'],
      defaultId: 1,
      message: `Versioon ${fromSemVer(available)} on saadaval.`,
      title: 'Uuendus saadaval!',
      detail: `Teil on alla laetud versioon ${_VERSION}.\nKas laadida alla uus versioon?`
    }).then((button) => {
      if (button.response === 1) {
        remote.shell.openExternal(url).catch(console.log);
      }
    }).finally(() => {
      autoUpdateState(UpdateIdle);
    });
  };

  const checkUpdates = () => {
    autoUpdateState(UpdateChecking);
    axios.get(API).then((res) => {
      let latest = res.data[0];
      console.log(latest.name, '>', VERSION);
      if (gt(latest.name, VERSION)) {
        for (let i of latest.assets) {
          if (i.name.endsWith('dmg')) {
            confirmUpdate(latest.name, i.browser_download_url);
            return;
          }
        }
      }

      autoUpdateState(UpdateIdle);
    });
  };
  return (
    <div className={styles.bar} data-tid="bar">
      {Object.entries(routes).map((j, i) => {
        let classname = styles.option;
        let keyname = j[0];
        if (keyname.startsWith('_')) {
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
        className={`fa ${menu.autoUpdate === UpdateIdle ? 'fa-cloud-download-alt' : menu.autoUpdate === UpdateChecking ? 'fa-sync' : menu.autoUpdate === UpdateAvailable ? 'fa-cloud-download-alt ' + styles.green : 'fa-question'} fa-2x ${styles.icon}`}
        onClick={checkUpdates}
      />
    </div>
  );
}
