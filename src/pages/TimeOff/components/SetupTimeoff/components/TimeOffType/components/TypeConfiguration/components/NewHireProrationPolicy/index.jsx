import { Card, Col, Radio, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const NewHireProrationPolicy = () => {
  return (
    <Card title="New Hire Proration Policy" className={styles.NewHireProrationPolicy}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>
            Should new hires have their leave balance prorated for the 1st time period ?
          </span>
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
export default connect(() => ({}))(NewHireProrationPolicy);
