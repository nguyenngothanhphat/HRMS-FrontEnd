import { Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { FORM_ITEM_NAME } from '@/utils/timeOff';
import styles from './index.less';

const LeaveApplicationStart = () => {
  return (
    <Card title="Leave Application Start" className={styles.LeaveApplicationStart}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>
            Minimum number of calendar days before a newly onboarded employee can apply for a leave.
          </span>
        </Col>
        <Col sm={8}>
          <Form.Item name={FORM_ITEM_NAME.LEAVE_APPLICATION_START_VALUE}>
            <Input type="number" suffix="days" min={0} max={100} defaultValue="0" />
          </Form.Item>
        </Col>
        <Col sm={6} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(LeaveApplicationStart);
