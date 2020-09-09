import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import BasicInformationHeader from './components/BasicInformationHeader';
import BasicInformationReminder from './components/BasicInformationReminder';
import BottomBar from '../../../../components/BottomBar';

import styles from './index.less';

export default class BasicInformation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpenReminder: false,
    };
  }

  onFinish = (values) => {
    const newValues = { ...values };
    newValues.workEmail += '@terralogic.com';
    // console.log('Success:', newValues);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  onClickClose = () => {
    this.setState({
      isOpenReminder: false,
    });
  };

  onFocus = () => {
    this.setState({
      isOpenReminder: true,
    });
  };

  _renderForm = () => {
    const { isOpenReminder } = this.state;
    return (
      <Form
        className={styles.basicInformation__form}
        wrapperCol={{ span: 24 }}
        name="basic"
        initialValues={{ remember: true }}
        onFocus={this.onFocus}
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
              name="fullName"
              rules={[{ required: true, message: 'Please input your full name!' }]}
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
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
                {
                  type: 'email',
                  message: 'Email invalid!',
                },
              ]}
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
            >
              <p className={styles.formInput__domain}>@terralogic.com</p>
              <Input className={styles.formInput} />
            </Form.Item>
          </Col>
          {isOpenReminder ? <BasicInformationReminder onClickClose={this.onClickClose} /> : null}
        </Row>
        <Row gutter={[48, 0]}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label="Previous experience in years"
              name="experienceYear"
              rules={[
                {
                  pattern: /^[0-9]*$/,
                  message: 'Year of experience invalid!',
                },
              ]}
            >
              <Input className={styles.formInput} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

  render() {
    return (
      <div className={styles.basicInformation}>
        <Row gutter={[24, 0]}>
          <Col span={16}>
            <div className={styles.basicInformation__top}>
              <BasicInformationHeader />
              <hr />
              {this._renderForm()}
            </div>

            {/* <div className={styles.basicInformation__bottom}> */}
            <BottomBar />
            {/* </div> */}
          </Col>
          <Col span={8}>asdsd</Col>
        </Row>
      </div>
    );
  }
}
