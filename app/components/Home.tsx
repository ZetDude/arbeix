import React from 'react';
import styles from './Home.css';
import { _VERSION } from '../constants/version';

export default function Home() {
  return (
    <div className={styles.fancy}>
      <div className={styles.container} data-tid="container">
        <h2>Arbeix</h2>
        <span>
          Verx 2020
          <br />
        </span>
        <span>
          <em>Versioon {_VERSION}</em>
          <br />
        </span>
      </div>
    </div>
  );
}
