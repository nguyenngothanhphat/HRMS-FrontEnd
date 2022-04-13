import { Card, Col, Form, InputNumber, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const AccrualStart = (props) => {
  const { dispatch } = props;
  const onChange = () => {};
  return (
    <Card title="Accrual Start" className={styles.LeaveType}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>
            Minimum number of calendar days before the accrual starts for a newly onboarded
            employee.
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
export default connect(() => ({}))(AccrualStart);
