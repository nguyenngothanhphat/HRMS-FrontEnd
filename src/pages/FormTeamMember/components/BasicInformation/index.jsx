import React, { PureComponent } from 'react';
import { Row, Col, Form, Input } from 'antd';
import BasicInformationHeader from './components/BasicInformationHeader';
import BasicInformationReminder from './components/BasicInformationReminder';

import styles from './index.less';

export default class BasicInformation extends PureComponent {
  onFinish = (values) => {
    console.log('Success:', values);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    return (
      <div className={styles.basicInformation}>
        <BasicInformationHeader />
        <hr />
        <Form
          className={styles.basicInformation__form}
          wrapperCol={{ span: 24 }}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Row gutter={[48, 0]}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                required={false}
                label="Full Name*"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input className={styles.formInput} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                required={false}
                label="Private e-mail id*"
                name="privateEmail"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input className={styles.formInput} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                required={false}
                label="Work email id*"
                className={styles.formInput__email}
                name="workEmail"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <p className={styles.formInput__domain}>@terralogic.com</p>
                <Input className={styles.formInput} />
              </Form.Item>
            </Col>
            <BasicInformationReminder />
          </Row>
          <Row gutter={[48, 0]}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                required={false}
                label="Previous experience in years"
                name="workEmail"
              >
                <Input className={styles.formInput} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
