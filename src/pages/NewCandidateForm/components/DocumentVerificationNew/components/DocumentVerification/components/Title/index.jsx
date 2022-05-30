import React from 'react';
import { Col, Typography } from 'antd';
import styles from './index.less';

const Title = () => {
  return (
    <Col span={24} className={styles.Title}>
      <Typography.Title level={4} className={styles.title}>
        Eligibility Documents
      </Typography.Title>
      <Typography.Text className={styles.text}>
        Please select all the documents needed to establish the candidates eligibility.
      </Typography.Text>
    </Col>
  );
};

export default Title;
