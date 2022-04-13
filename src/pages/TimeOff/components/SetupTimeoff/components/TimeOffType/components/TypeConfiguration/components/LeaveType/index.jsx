import { Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const LeaveType = (props) => {
  const { dispatch } = props;

  return (
    <Card title="Leave Type" className={styles.LeaveType}>
      <Row gutter={[24, 24]}>
        <Col sm={8}>
          <span className={styles.label}>Enter the name of the leave Type</span>
        </Col>
        <Col sm={10}>
          <Form.Item>
            <Input placeholder="Type Name" />
          </Form.Item>
        </Col>
        <Col sm={6} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(LeaveType);
