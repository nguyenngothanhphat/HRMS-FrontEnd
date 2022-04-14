import { Card, Col, Form, InputNumber, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const LeaveApplicationStart = () => {
  const onChange = () => {};
  return (
    <Card title="Leave Application Start" className={styles.LeaveApplicationStart}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>
            Minimum number of calendar days before a newly onboarded employee can apply for a leave.
          </span>
        </Col>
        <Col sm={8}>
          <Form.Item>
            <InputNumber prefix="days" min={0} max={100000} defaultValue="0" onChange={onChange} />
            <span className={styles.prefix}>days</span>
          </Form.Item>
        </Col>
        <Col sm={6} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(LeaveApplicationStart);
