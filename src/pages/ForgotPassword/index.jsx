import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['login/login'],
}))
class ForgotPassword extends Component {
  onFinish = (values) => {
    const payload = { email: values.email, password: values.password };
    this.handleSubmit(payload);
  };

  handleSubmit = (values) => {
    alert(values);
  };

  _renderButton = (getFieldValue) => {
    const { loading } = this.props;
    const valueEmail = getFieldValue('email');
    return (
      <Button type="primary" htmlType="submit" loading={loading} disabled={!valueEmail}>
        Send
      </Button>
    );
  };

  render() {
    return (
      <div className={styles.formWrapper}>
        <p className={styles.formWrapper__title}>Forgot Password?</p>
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
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.email !== currentValues.email}
          >
            {({ getFieldValue }) => this._renderButton(getFieldValue)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default ForgotPassword;
