import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';
import EditIcon from '@/assets/timeOff/edit.svg';
import DelIcon from '@/assets/timeOff/del.svg';

const AccrualRate = (props) => {
  const { item = {} } = props;

  return (
    <div className={styles.AccrualRate}>
      <Row align="middle">
        <Col sm={12}>
          <div className={styles.leftPart}>
            <span>From</span>
            <Form.Item>
              <Input />
            </Form.Item>
            <span>Years to Less than</span>
            <Form.Item>
              <Input />
            </Form.Item>
            <span>Years of Service</span>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.rightPart}>
            <Form.Item>
              <Input />
            </Form.Item>
            <span>Days per Year</span>
          </div>
        </Col>
        <Col sm={4}>
          <div className={styles.actions}>
            <img src={EditIcon} alt="" />
            <img src={DelIcon} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default connect(() => ({}))(AccrualRate);
