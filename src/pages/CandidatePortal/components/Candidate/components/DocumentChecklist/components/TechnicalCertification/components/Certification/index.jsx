import { CloseOutlined } from '@ant-design/icons';
import { Checkbox, Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

const Certification = (props) => {
  const {
    index = 0,
    onRemove = () => {},
    certification: {
      name = '', // name
      neverExpired = false,
      issuedDate = '',
      expiryDate = '',
    } = {},
    onValuesChange: onValuesChangeProp = () => {},
    disabled = false,
  } = props;

  const [isNeverExpired, setIsNeverExpired] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setIsNeverExpired(neverExpired);
    setStartDate(issuedDate ? moment(issuedDate) : null);
    setEndDate(expiryDate ? moment(expiryDate) : null);
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
    setStartDate(allValues.issuedDate);
    setEndDate(allValues.expiryDate);
    setIsNeverExpired(allValues.neverExpired);
    onValuesChangeProp(index, allValues);
  };

  return (
    <div className={styles.Certification}>
      <div className={styles.titleBar}>
        <span className={styles.title}>Certification {minTwoDigits(index + 1)}</span>
        {!disabled && (
          <CloseOutlined
            // style={length === 1 ? { display: 'none' } : { display: 'block' }}
            className={styles.deleteIcon}
            onClick={() => onRemove(index)}
          />
        )}
      </div>
      <Form
        name="basic"
        initialValues={{
          name,
          neverExpired,
          issuedDate: issuedDate ? moment(issuedDate) : null,
          expiryDate: expiryDate ? moment(expiryDate) : null,
        }}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="Certification name"
          name="name"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: 'Required field',
            },
          ]}
        >
          <Input disabled={disabled} placeholder="Certification name" />
        </Form.Item>

        <Form.Item name="neverExpired" valuePropName="checked">
          <Checkbox disabled={disabled}>Never expires</Checkbox>
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Issued date"
              name="issuedDate"
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
                placeholder="Issued date"
                format="MM/DD/YYYY"
                disabled={disabled}
              />
            </Form.Item>
          </Col>
          {!isNeverExpired && (
            <Col span={12}>
              <Form.Item
                label="Validity date"
                name="expiryDate"
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
                  placeholder="Validity date"
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
export default Certification;
