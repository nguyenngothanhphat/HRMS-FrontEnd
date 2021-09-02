import React from 'react';
import { Typography } from 'antd';
import styles from './index.less';

const Title = () => {
  return (
    <div className={styles.Title}>
      <Typography.Title level={4} className={styles.title}>
        Eligibility Documents
      </Typography.Title>
      <Typography.Text className={styles.text}>
        Please select all the documents needed to establish the candidates eligibility.
      </Typography.Text>
    </div>
  );
};

export default Title;
