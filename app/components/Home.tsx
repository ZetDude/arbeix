import React from 'react';
import styles from './Home.css';

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
          <em>Versioon ω0.4</em>
        </span>
      </div>
    </div>
  );
}
