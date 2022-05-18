import { Col, Form, Input, Popconfirm, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';
// import EditIcon from '@/assets/timeOff/edit.svg';
import DelIcon from '@/assets/timeOff/del.svg';
import { FORM_ITEM_NAME, TIMEOFF_ACCRUAL_METHOD } from '@/utils/timeOff';

const { DAYS_OF_YEAR, DAYS_OF_QUARTER, DAYS_OF_MONTH, DAYS_OF_FORTNIGHT } = TIMEOFF_ACCRUAL_METHOD;

const AccrualRate = (props) => {
  const { name = '', remove = () => {}, selectedType = '' } = props;

  const getStringByType = () => {
    switch (selectedType) {
      case DAYS_OF_YEAR:
        return 'per Year';
      case DAYS_OF_QUARTER:
        return 'per Quarter';
      case DAYS_OF_MONTH:
        return 'per Month';
      case DAYS_OF_FORTNIGHT:
        return 'per Fortnight';

      default:
        return '';
    }
  };

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
              <Input placeholder="0" type="number" min={0} max={100} />
            </Form.Item>
            <span>Years to Less than</span>
            <Form.Item
              name={[name, FORM_ITEM_NAME.TO]}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input placeholder="0" type="number" min={0} max={100} />
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
              <Input placeholder="0" type="number" min={0} max={100} />
            </Form.Item>
            <span>Days {getStringByType()}</span>
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
