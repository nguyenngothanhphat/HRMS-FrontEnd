import React from 'react';
import { Typography } from 'antd';
import styles from './index.less';

const Title = () => {
  return (
    <div className={styles.Title}>
      <Typography.Title level={4} className={styles.title}>
        Upload Documents
      </Typography.Title>
      <Typography.Text className={styles.text}>
        All documents supporting candidate’s employment eligibility will be displayed here
      </Typography.Text>
    </div>
  );
};

export default Title;
