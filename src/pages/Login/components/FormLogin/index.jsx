import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['login/login'],
}))
class FormLogin extends Component {
  onFinish = (values) => {
    const payload = { email: values.email, password: values.password };
    this.handleSubmit(payload);
  };

  onFinishFailed = (errorInfo) => {};

  handleSubmit = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };

  render() {
    const { loading = false } = this.props;
    return (
      <div className={styles.formWrapper}>
        <p>Sign in to your account</p>
        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="Enter company email address"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Keep me sign in</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default FormLogin;
