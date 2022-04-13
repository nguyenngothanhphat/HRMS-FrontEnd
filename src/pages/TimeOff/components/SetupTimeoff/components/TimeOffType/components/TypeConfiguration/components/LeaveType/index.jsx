import { Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const LeaveType = () => {
  return (
    <Card title="Leave Type Name" className={styles.LeaveType}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>Enter the name of the leave type</span>
        </Col>
        <Col sm={8}>
          <Form.Item name="name">
            <Input placeholder="Type Name" />
          </Form.Item>
        </Col>
        <Col sm={6} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(LeaveType);
