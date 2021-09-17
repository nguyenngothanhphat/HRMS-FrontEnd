import React from 'react';
import filterIcon from '@/assets/offboarding-filter.svg';
import styles from '../../index.less';

const DocumentResult = (props) => {
  return (
    <div className={styles.resultContent}>
      <div className={styles.filter}>
        <img src={filterIcon} alt="filter icon" />
      </div>
      <div className={styles.result}>table</div>
    </div>
  );
};
export default DocumentResult;
