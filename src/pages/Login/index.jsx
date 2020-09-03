import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { Link, connect } from 'umi';

import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['login/login'],
}))
class FormLogin extends Component {
  onFinish = (values) => {
    const payload = { email: values.email, password: values.password };
    this.handleSubmit(payload);
  };

  handleSubmit = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };

  _renderButton = (getFieldValue) => {
    const { loading } = this.props;
    const valueEmail = getFieldValue('email');
    const valuePsw = getFieldValue('password');
    return (
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        disabled={!valueEmail || !valuePsw}
      >
        Login
      </Button>
    );
  };

  render() {
    return (
      <div className={styles.formWrapper}>
        <p className={styles.formWrapper__title}>Sign in to your account</p>
        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          requiredMark={false}
          ref={this.formRef}
        >
          <Form.Item
            label="Enter company email address"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Email invalid',
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
          <Link to="/forgot-password">
            <p style={{ fontSize: '13px', textDecoration: 'underline', margin: '0px' }}>
              Forgot Password?
            </p>
          </Link>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Keep me signed in</Checkbox>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.email !== currentValues.email ||
              prevValues.password !== currentValues.password
            }
          >
            {({ getFieldValue }) => this._renderButton(getFieldValue)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default FormLogin;
