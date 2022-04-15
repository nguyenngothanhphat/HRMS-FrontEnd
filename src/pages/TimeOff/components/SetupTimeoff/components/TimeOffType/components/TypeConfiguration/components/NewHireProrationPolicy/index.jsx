import { Card, Col, Form, Radio, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { FORM_ITEM_NAME } from '@/utils/timeOff';
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
            <Form.Item name={FORM_ITEM_NAME.NEW_HIRE_PRORATION_POLICY} valuePropName="value">
              <Radio.Group buttonStyle="solid">
                <Radio.Button value>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
        </Col>
        <Col sm={6} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(NewHireProrationPolicy);
