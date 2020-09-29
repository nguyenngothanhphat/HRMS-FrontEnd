import React, { Component } from 'react';
import { Col, Row, Form, Input, Radio } from 'antd';
import styles from './index.less';

class NonExtempNoticeForm extends Component {
  _renderForm = () => {
    return (
      <Form
        className={styles.NonExtempNoticeForm_form}
        wrapperCol={{ span: 24 }}
        // initialValues={{ fullName, privateEmail, workEmail, experienceYear }}
      >
        <Row gutter={[24, 12]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item name="radio-group" label="Are you self-insured?">
              <Radio.Group>
                <Radio value>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={`Insurance carrier's name`}
              name="carrierName"
            >
              <Input className={styles.formInput} name="carrierName" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={`Insurance carrier's address`}
              name="carrierAddress"
            >
              <Input className={styles.formInput} name="carrierAddress" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label="Phone number"
              name="phoneNumber"
            >
              <Input className={styles.formInput} name="phoneNumber" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label="Policy number"
              name="policyNumber"
            >
              <Input className={styles.formInput} name="policyNumber" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    return (
      <Row>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={styles.NonExtempNoticeForm}>
            <div className={styles.NonExtempNoticeForm_title}>Worker's compensation</div>
            <hr />
            {this._renderForm()}
          </div>
        </Col>
      </Row>
    );
  }
}

export default NonExtempNoticeForm;
