import React from 'react';
import { Col, Typography } from 'antd';
import styles from './index.less';

const Title = () => {
  return (
    <Col span={24} className={styles.Title}>
      <Typography.Title level={4} className={styles.title}>
        Pre-Joining Documents
      </Typography.Title>
      <Typography.Text className={styles.text}>
        All documents supporting candidate’s employment eligibility will be displayed here
      </Typography.Text>
    </Col>
  );
};

export default Title;
