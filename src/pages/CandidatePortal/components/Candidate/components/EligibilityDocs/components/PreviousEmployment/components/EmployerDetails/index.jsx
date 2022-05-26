import { Checkbox, Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
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
    onValuesChange: onValuesChangeProp = () => {},
    disabled = false,
    disabledCurrentlyWorking = false,
  } = props;

  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setIsCurrentlyWorking(currentlyWorking);
    setStartDate(startDateProp ? moment(startDateProp) : null);
    setEndDate(endDateProp ? moment(endDateProp) : null);
  }, []);

  const minTwoDigits = (n) => {
    return (n < 10 ? '0' : '') + n;
  };

  // DISABLE DATE OF DATE PICKER
  const disabledStartDate = (current) => {
    if (endDate) {
      return current && current > moment(endDate);
    }
    return null;
  };

  const disabledEndDate = (current) => {
    if (startDate) {
      return current && current < moment(startDate);
    }
    return null;
  };

  const onValuesChange = (changedValues, allValues) => {
    setStartDate(allValues.startDate);
    setEndDate(allValues.endDate);
    setIsCurrentlyWorking(allValues.currentlyWorking);
    onValuesChangeProp(index, allValues);
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
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="Name of the employer"
          name="employer"
          labelCol={{ span: 24 }}
          rules={[{ required: true, message: 'Required field' }]}
        >
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item name="currentlyWorking" valuePropName="checked">
          <Checkbox
            disabled={disabled || disabledCurrentlyWorking}
            onChange={(e) => setIsCurrentlyWorking(e.target.checked)}
          >
            Currently working
          </Checkbox>
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Required field',
                },
              ]}
            >
              <DatePicker
                disabledDate={disabledStartDate}
                placeholder="Start date"
                format="MM/DD/YYYY"
                disabled={disabled}
              />
            </Form.Item>
          </Col>
          {!isCurrentlyWorking && (
            <Col span={12}>
              <Form.Item
                label="End Date"
                name="endDate"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Required field',
                  },
                ]}
              >
                <DatePicker
                  disabledDate={disabledEndDate}
                  placeholder="End date"
                  disabled={disabled}
                  format="MM/DD/YYYY"
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
};
export default EmployerDetails;
