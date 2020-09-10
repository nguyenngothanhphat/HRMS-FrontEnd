import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { EyeFilled } from '@ant-design/icons';
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
        Sign in
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
            label="Email address"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Invalid email',
              },
            ]}
          >
            <Input className={styles.InputEmail} />
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
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeFilled style={{ color: '#2c6df9' }} /> : <EyeFilled />
              }
              className={styles.inputPassword}
            />
          </Form.Item>
          <Form.Item className={styles.checkbox} name="remember" valuePropName="checked">
            <Checkbox>
              <span>Keep me signed in</span>
            </Checkbox>
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
          <Link to="/forgot-password">
            <p className={styles.forgotPassword}>Forgot Password?</p>
          </Link>
        </Form>
      </div>
    );
  }
}

export default FormLogin;
