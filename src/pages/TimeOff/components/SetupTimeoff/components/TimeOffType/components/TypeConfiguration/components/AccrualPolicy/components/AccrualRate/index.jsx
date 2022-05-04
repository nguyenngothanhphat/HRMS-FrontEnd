import { Col, Form, Input, Popconfirm, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';
// import EditIcon from '@/assets/timeOff/edit.svg';
import DelIcon from '@/assets/timeOff/del.svg';
import { FORM_ITEM_NAME } from '@/utils/timeOff';

const AccrualRate = (props) => {
  const { name = '', remove = () => {} } = props;

  return (
    <div className={styles.AccrualRate}>
      <Row align="middle">
        <Col sm={12}>
          <div className={styles.leftPart}>
            <span>From</span>
            <Form.Item
              name={[name, FORM_ITEM_NAME.FROM]}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input placeholder="0" type="number" />
            </Form.Item>
            <span>Years to Less than</span>
            <Form.Item
              name={[name, FORM_ITEM_NAME.TO]}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input placeholder="0" type="number" />
            </Form.Item>
            <span>Years of Service</span>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.rightPart}>
            <Form.Item
              name={[name, FORM_ITEM_NAME.VALUE]}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input placeholder="0" type="number" />
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
