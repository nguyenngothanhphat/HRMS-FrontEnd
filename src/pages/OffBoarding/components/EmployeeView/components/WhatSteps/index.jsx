import { Col, Row } from 'antd';
import React from 'react';
import styles from './index.less';

const WhatSteps = () => {
  return (
    <div className={styles.WhatSteps}>
      <div className={styles.title}>Next steps ...</div>
      <Row className={styles.container} gutter={[48, 0]}>
        <Col span={12} className={styles.step1}>
          <div className={styles.stepNumber}>
            <span>1</span>
          </div>
          <div className={styles.stepContent}>
            You will soon be receiving an exit interview package. Do go through the check list and
            submit it before the exit interview
          </div>
        </Col>
        <Col span={12} className={styles.step2}>
          <div className={styles.stepNumber}>
            <span>2</span>
          </div>
          <div className={styles.stepContent}>
            The HR will soon send an invitation for your final exit interview.
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default WhatSteps;
