import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

const BasicInfo = (props) => {
  const { disabled = false, testValidate = () => {} } = props;

  return (
    <div className={styles.BasicInfo}>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={formatMessage({ id: 'component.basicInformation.firstName' })}
            name="firstName"
            rules={[
              { required: true, message: 'Required field' },
              {
                pattern: /[^\s-]/,
                message: 'First name is invalid!',
              },
            ]}
          >
            <Input
              disabled={disabled}
              autoComplete="off"
              // onChange={(e) => handleChange(e)}
              placeholder="First Name"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={formatMessage({ id: 'component.basicInformation.middleName' })}
            name="middleName"
            rules={[
              {
                pattern: /[^\s-]/,
                message: 'Middle name is invalid!',
              },
            ]}
          >
            <Input
              disabled={disabled}
              autoComplete="off"
              // onChange={(e) => handleChange(e)}
              placeholder="Middle Name"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={formatMessage({ id: 'component.basicInformation.lastName' })}
            name="lastName"
            rules={[
              { required: true, message: 'Required field' },
              {
                pattern: /[^\s-]/,
                message: 'Last name is invalid!',
              },
            ]}
          >
            <Input
              disabled={disabled}
              autoComplete="off"
              // onChange={(e) => handleChange(e)}
              placeholder="Last Name"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label="Total Experience in years"
            name="totalExperience"
            rules={[
              {
                pattern: /\b([0-9]|[1-9][0-9])\b/,
                message: 'Invalid format',
              },
              {
                pattern: /^\d{1,2}$|^\d+\.\d{0,2}$/,
                message: 'Only digit!',
              },
            ]}
          >
            <Input
              disabled={disabled}
              autoComplete="off"
              placeholder="Total Experience in years"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label="Relevant Experience in years"
            name="previousExperience"
            rules={[
              {
                pattern: /\b([0-9]|[1-9][0-9])\b/,
                message: 'Invalid format',
              },
              {
                pattern: /^\d{1,2}$|^\d+\.\d{0,2}$/,
                message: 'Only digit!',
              },
            ]}
          >
            <Input
              disabled={disabled}
              autoComplete="off"
              placeholder="Relevant Experience in years"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={formatMessage({ id: 'component.basicInformation.privateEmail' })}
            name="privateEmail"
            rules={[
              { required: true, message: 'Required field' },
              {
                type: 'email',
                message: 'Invalid email',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('workEmail') !== value) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line compat/compat
                  return Promise.reject(new Error('Two emails cannot be the same!'));
                },
              }),
            ]}
          >
            <Input
              disabled={disabled}
              autoComplete="off"
              // onChange={(e) => handleChange(e)}
              placeholder="Personal Email"
              className={styles.formInput}
              onChange={testValidate}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Required field' },
              {
                // pattern: /^\d+$/,
                pattern:
                  // eslint-disable-next-line no-useless-escape
                  /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?$/gm,
                message: 'Invalid phone number !',
              },
            ]}
          >
            <Input
              disabled={disabled}
              autoComplete="off"
              placeholder="Phone Number"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default connect(() => ({}))(BasicInfo);
