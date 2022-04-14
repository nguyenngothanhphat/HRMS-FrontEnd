import { Col, Form, Input, Popconfirm, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';
// import EditIcon from '@/assets/timeOff/edit.svg';
import DelIcon from '@/assets/timeOff/del.svg';

const AccrualRate = (props) => {
  const { name = '', remove = () => {} } = props;

  return (
    <div className={styles.AccrualRate}>
      <Row align="middle">
        <Col sm={12}>
          <div className={styles.leftPart}>
            <span>From</span>
            <Form.Item
              name={[name, 'from']}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input placeholder="0" />
            </Form.Item>
            <span>Years to Less than</span>
            <Form.Item name={[name, 'to']} rules={[{ required: true, message: 'Required field!' }]}>
              <Input placeholder="0" />
            </Form.Item>
            <span>Years of Service</span>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.rightPart}>
            <Form.Item
              name={[name, 'value']}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input placeholder="0" />
            </Form.Item>
            <span>Days per Year</span>
          </div>
        </Col>
        <Col sm={4}>
          <div className={styles.actions}>
            {/* <img src={EditIcon} alt="" /> */}
            <Popconfirm title="Sure to remove?" onConfirm={() => remove(name)}>
              <img src={DelIcon} alt="" />
            </Popconfirm>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default connect(() => ({}))(AccrualRate);
