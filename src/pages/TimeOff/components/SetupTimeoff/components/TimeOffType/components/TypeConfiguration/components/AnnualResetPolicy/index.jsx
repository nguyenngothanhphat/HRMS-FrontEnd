import { Card, Col, Form, DatePicker, Row, Radio, Space } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import datePickerIcon from '@/assets/timeOff/datePicker.svg';
import styles from './index.less';

const AnnualResetPolicy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onChange = () => {};
  return (
    <Card title="Negative Leave Balance" className={styles.AnnualResetPolicy}>
      <div className={styles.annualResetTop}>
        <span className={styles.label}>How do you want to reset?</span>
        <Radio.Group name="accrualMethod" defaultValue={1}>
          <Space direction="horizontal">
            <Radio value={1}>Anniversary Date</Radio>
            <Radio value={2}>Calendar Date</Radio>
          </Space>
        </Radio.Group>
      </div>

      <Row>
        <Col sm={5}>
          <span className={styles.label}>Select Date</span>
        </Col>
        <Col sm={8}>
          <Form.Item>
            <DatePicker
              suffixIcon={<img src={datePickerIcon} alt="" />}
              onChange={onChange}
              format={isOpen ? 'MM-DD-YYYY' : 'dddd Do'}
              onOpenChange={(status) => {
                setIsOpen(status);
              }}
            />
          </Form.Item>
        </Col>
        <Col sm={11} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(AnnualResetPolicy);
