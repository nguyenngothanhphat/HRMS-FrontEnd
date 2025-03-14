import { Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { FORM_ITEM_NAME } from '@/constants/timeOff';
import styles from './index.less';

const AccrualStart = () => {
  return (
    <Card title="Accrual Start" className={styles.AccrualStart}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>
            Minimum number of calendar days before the accrual starts for a newly onboarded
            employee.
          </span>
        </Col>
        <Col sm={8}>
          <Form.Item name={FORM_ITEM_NAME.ACCRUAL_START_VALUE}>
            <Input suffix="days" type="number" min={0} max={100} defaultValue="0" />
          </Form.Item>
        </Col>
        <Col sm={6} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(AccrualStart);
