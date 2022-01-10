import React from 'react';
import styles from './index.less';

const Welcome = () => {
  return (
    <div className={styles.Welcome}>
      <p className={styles.Welcome__helloText}>Hello Arun!</p>
      <span className={styles.Welcome__notificationText}>
        You have <span className={styles.number}>16 notifications</span> today
      </span>
    </div>
  );
};

export default Welcome;
