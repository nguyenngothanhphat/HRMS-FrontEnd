import { Card, Col, Form, DatePicker, Row, Radio, Space } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import datePickerIcon from '@/assets/timeOff/datePicker.svg';
import styles from './index.less';
import { FORM_ITEM_NAME } from '@/utils/timeOff';

const AnnualResetPolicy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onChange = () => {};
  return (
    <Card title="Annual Reset Policy" className={styles.AnnualResetPolicy}>
      <div className={styles.annualResetTop}>
        <span className={styles.label}>How do you want to reset?</span>
        <Form.Item name={FORM_ITEM_NAME.ANNUAL_RESET_POLICY_RESET_TYPE}>
          <Radio.Group>
            <Space direction="horizontal">
              <Radio value="anniversaryDate">Anniversary Date</Radio>
              <Radio value="calendarDate">Calendar Date</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </div>

      <Row>
        <Col sm={5}>
          <span className={styles.label}>Select Date</span>
        </Col>
        <Col sm={8}>
          <Form.Item
            name={FORM_ITEM_NAME.ANNUAL_RESET_POLICY_CALENDAR_DATE}
            rules={[{ required: true, message: 'Required field!' }]}
          >
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
