import { Checkbox, Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import styles from './index.less';

const EmployerDetails = (props) => {
  const {
    index = 0,
    employer: {
      employer = '', // name
      currentlyWorking = false,
      startDate: startDateProp = '',
      endDate: endDateProp = '',
    } = {},
  } = props;

  const minTwoDigits = (n) => {
    return (n < 10 ? '0' : '') + n;
  };

  return (
    <div className={styles.EmployerDetails}>
      <div className={styles.titleBar}>
        <span className={styles.title}>Employer {minTwoDigits(index + 1)} Details</span>
      </div>
      <Form
        name="basic"
        initialValues={{
          employer,
          currentlyWorking,
          startDate: startDateProp ? moment(startDateProp) : null,
          endDate: endDateProp ? moment(endDateProp) : null,
        }}
      >
        <Form.Item
          label="Name of the employer"
          name="employer"
          labelCol={{ span: 24 }}
          rules={[{ required: true, message: 'Required field' }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item name="currentlyWorking" valuePropName="checked">
          <Checkbox disabled>Currently working</Checkbox>
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Start Date" name="startDate" labelCol={{ span: 24 }}>
              <DatePicker placeholder="Start date" format="MM/DD/YYYY" disabled />
            </Form.Item>
          </Col>
          {!currentlyWorking && (
            <Col span={12}>
              <Form.Item label="End Date" name="endDate" labelCol={{ span: 24 }}>
                <DatePicker placeholder="End date" disabled format="MM/DD/YYYY" />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
};
export default EmployerDetails;
