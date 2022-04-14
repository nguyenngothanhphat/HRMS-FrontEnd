import { Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const MinimumLeaveAmount = (props) => {
  const { dispatch } = props;
  const onChange = () => {};
  return (
    <Card title="Minimum Leave Amount" className={styles.MinimumLeaveAmount}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>Minimum amount of leave that needs to be applied.</span>
        </Col>
        <Col sm={10}>
          <Form.Item>
            <Input onChange={onChange} defaultValue="0" />
            <span className={styles.prefix}>days</span>
          </Form.Item>
        </Col>
        <Col sm={4} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(MinimumLeaveAmount);
