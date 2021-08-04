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
        Please choose all the acceptable documents that the candidate can provide. The mandatory
        documents are required and cannot be deselected.
      </Typography.Text>
    </div>
  );
};

export default Title;
