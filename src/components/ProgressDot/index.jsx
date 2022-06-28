import React from 'react';
import styles from './index.less';

const ProcessDot = ({ name = '', color = '', fontSize = 13, fontWeight = 500 }) => {
  return (
    <div className={styles.ProcessDot}>
      <span
        className={styles.dot}
        style={{
          backgroundColor: color,
        }}
      />
      <span
        className={styles.statusText}
        style={{
          color,
          fontSize,
          fontWeight,
        }}
      >
        {name}
      </span>
    </div>
  );
};
export default ProcessDot;
