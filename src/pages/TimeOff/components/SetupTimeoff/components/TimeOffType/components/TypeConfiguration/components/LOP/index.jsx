import { Card, Col, Radio, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const LOP = () => {
  return (
    <Card title="New Hire Proration Policy" className={styles.LOP}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>Leave accrues during LOP / Sabbatical ?</span>
        </Col>
        <Col sm={8}>
          <div className={styles.viewTypeSelector}>
            <Radio.Group buttonStyle="solid" defaultValue="Yes">
              <Radio.Button value="Yes">Yes</Radio.Button>
              <Radio.Button value="No">No</Radio.Button>
            </Radio.Group>
          </div>
        </Col>
        <Col sm={6} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(LOP);
