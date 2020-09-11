import React, { PureComponent } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { connect } from 'umi';

import BasicInformationHeader from './components/BasicInformationHeader';
import BasicInformationReminder from './components/BasicInformationReminder';

import styles from './index.less';

@connect(({ info: { basicInformation } = {} }) => ({
  basicInformation,
}))
class BasicInformation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpenReminder: false,
    };
  }

  static getDerivedStateFromProps(props) {
    if ('basicInformation' in props) {
      return { basicInformation: props.basicInformation || {} };
    }
    return null;
  }

  handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    const { basicInformation } = this.state;
    const { dispatch } = this.props;
    basicInformation[name] = value;

    dispatch({
      type: 'info/saveBasicInformation',
      payload: {
        basicInformation,
      },
    });
  };

  onChangeFormData = (key, value) => {
    const { myInfo } = this.state;
    myInfo[key] = value;
    this.setState({
      myInfo,
    });
  };

  // onFinish = (values) => {
  //   const newValues = { ...values };
  //   newValues.workEmail += '@terralogic.com';
  //   console.log('Success:', newValues);
  // };

  // onFinishFailed = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };

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
    const { isOpenReminder, basicInformation = {} } = this.state;
    const { fullName, privateEmail, workEmail, experienceYear } = basicInformation;
    return (
      <Form
        className={styles.basicInformation__form}
        wrapperCol={{ span: 24 }}
        name="basic"
        initialValues={{ fullName, privateEmail, workEmail, experienceYear }}
        onFocus={this.onFocus}
        // onFinish={this.onFinish}
        // onFinishFailed={this.onFinishFailed}
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
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="fullName"
              />
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
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="privateEmail"
                // defaultValue={privateEmail}
              />
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
              {/* <p className={styles.formInput__domain}>@terralogic.com</p> */}
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="workEmail"
                // suffix="@terralogic.com"
                // defaultValue={workEmail}
              />
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
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="experienceYear"
                // defaultValue={experienceYear}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    return (
      <Row gutter={[24, 0]}>
        <Col span={16}>
          <div className={styles.basicInformation}>
            <div className={styles.basicInformation__top}>
              <BasicInformationHeader />
              <hr />
              {this._renderForm()}
            </div>
          </div>
        </Col>
        <Col span={8}>asdsd</Col>
      </Row>
    );
  }
}

export default BasicInformation;
