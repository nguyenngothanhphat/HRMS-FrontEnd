import React, { Component } from 'react';
import { Col, Row, Form, Input, Radio, Button } from 'antd';
import { formatMessage } from 'umi';

import styles from './index.less';

class NonExtempNoticeForm extends Component {
  onFinish = (values) => {
    console.log('Success:', values);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  _renderForm = () => {
    return (
      <Form
        className={styles.NonExtempNoticeForm_form}
        wrapperCol={{ span: 24 }}
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        // initialValues={{ fullName, privateEmail, workEmail, experienceYear }}
      >
        <Row gutter={[24, 6]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="isSelfInsured"
              label={formatMessage({ id: 'component.nonExtempNotice.isSelfInsured' })}
            >
              <Radio.Group>
                <Radio value>{formatMessage({ id: 'component.nonExtempNotice.yes' })}</Radio>
                <Radio value={false}>{formatMessage({ id: 'component.nonExtempNotice.no' })}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.nonExtempNotice.carrierName' })}
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
              label={formatMessage({ id: 'component.nonExtempNotice.carrierAddress' })}
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
              label={formatMessage({ id: 'component.nonExtempNotice.phoneNumber' })}
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
              label={formatMessage({ id: 'component.nonExtempNotice.policyNumber' })}
              name="policyNumber"
            >
              <Input className={styles.formInput} name="policyNumber" />
            </Form.Item>
          </Col>
          <Col xs={4} sm={4} md={4} lg={4} xl={4} offset={20}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'component.nonExtempNotice.save' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={12}> */}

        {/* </Row> */}
      </Form>
    );
  };

  render() {
    return (
      <Row>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={styles.NonExtempNoticeForm}>
            <div className={styles.NonExtempNoticeForm_title}>
              {formatMessage({ id: 'component.nonExtempNotice.formTitle' })}
            </div>
            <hr />
            {this._renderForm()}
          </div>
        </Col>
      </Row>
    );
  }
}

export default NonExtempNoticeForm;
