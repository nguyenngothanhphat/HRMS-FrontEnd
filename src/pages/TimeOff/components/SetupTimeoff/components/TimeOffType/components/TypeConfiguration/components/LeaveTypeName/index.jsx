import { Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';
import { FORM_ITEM_NAME } from '@/constants/timeOff';

const LeaveTypeName = () => {
  return (
    <Card title="Leave Type Name" className={styles.LeaveTypeName}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>Enter the name of the leave type</span>
        </Col>
        <Col sm={8}>
          <Form.Item
            name={FORM_ITEM_NAME.TIMEOFF_TYPE_NAME}
            rules={[{ required: true, message: 'Required field!' }]}
          >
            <Input placeholder="Enter the type name" />
          </Form.Item>
        </Col>
        <Col sm={6} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(LeaveTypeName);
