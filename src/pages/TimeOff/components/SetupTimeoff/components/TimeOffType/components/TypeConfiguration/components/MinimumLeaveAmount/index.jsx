import { Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { FORM_ITEM_NAME } from '@/utils/timeOff';
import styles from './index.less';

const MinimumLeaveAmount = () => {
  return (
    <Card title="Minimum Leave Amount" className={styles.MinimumLeaveAmount}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>Minimum amount of leave that needs to be applied.</span>
        </Col>
        <Col sm={10}>
          <Form.Item name={FORM_ITEM_NAME.MINIMUM_LEAVE_AMOUNT_VALUE}>
            <Input defaultValue="0" suffix="days" type="number" min={0} max={100} />
          </Form.Item>
        </Col>
        <Col sm={4} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(MinimumLeaveAmount);
