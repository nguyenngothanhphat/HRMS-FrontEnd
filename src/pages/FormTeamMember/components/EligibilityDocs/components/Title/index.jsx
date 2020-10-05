import React from 'react';
import { Typography } from 'antd';
import styles from './index.less';

const Title = ({ formatMessage = () => {} }) => {
  return (
    <div className={styles.Title}>
      <Typography.Title level={4} className={styles.title}>
        {formatMessage({ id: 'component.eligibilityDocs.title' })}
      </Typography.Title>
      <Typography.Text className={styles.text}>
        {formatMessage({ id: 'component.eligibilityDocs.subtitle' })}
      </Typography.Text>
    </div>
  );
};

export default Title;
