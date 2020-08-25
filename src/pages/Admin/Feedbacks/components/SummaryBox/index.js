import React from 'react';
import { Card } from 'antd';
import styles from './index.less';

const SummaryBox = props => {
  const { title = '', number = 0 } = props;
  return (
    <Card>
      <div className={styles.cardContent}>
        <span className={styles.title}>{title}</span>
        <span>{number}</span>
      </div>
    </Card>
  );
};

export default SummaryBox;
