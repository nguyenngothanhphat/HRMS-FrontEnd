import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { connect } from 'umi';

import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['changePassword/resetPassword'],
}))
class ResetPassword extends Component {
  onFinish = (values) => {
    const { password } = values;
    this.handleSubmit(password);
  };

  handleSubmit = (password) => {
    const {
      dispatch,
      match: { params: { reId: code = '' } = {} },
    } = this.props;
    const payload = {
      code,
      password,
    };
    dispatch({
      type: 'changePassword/resetPassword',
      payload,
    });
  };

  _renderButton = (getFieldValue) => {
    const { loading } = this.props;
    const valuePsw = getFieldValue('password');
    const valueConfirm = getFieldValue('confirmPassword');
    return (
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        disabled={!valuePsw || !valueConfirm}
      >
        Create Password
      </Button>
    );
  };

  render() {
    const arrText = [
      'Use a minimum of 8 characters',
      'At least one letter, one number and one special character.',
    ];
    return (
      <div className={styles.formWrapper}>
        <p className={styles.formWrapper__title}>Create New Password</p>
        {arrText.map((item) => (
          <div style={{ marginBottom: '0.5rem' }}>
            <CheckCircleFilled style={{ color: '#ACACAC', marginRight: '4px' }} />
            <span className={styles.formWrapper__description}>{item}</span>
          </div>
        ))}

        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          requiredMark={false}
          ref={this.formRef}
          style={{ marginTop: '1rem' }}
        >
          <Form.Item
            label="Enter Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your new password!',
              },
              {
                min: 8,
                message: 'Minimum of 8 characters!',
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{0,}$/,
                message: 'At least one letter, one number and one special character!',
              },
            ]}
          >
            <Input.Password className={styles.inputPassword} />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line compat/compat
                  return Promise.reject(
                    new Error('The two passwords that you entered do not match!'),
                  );
                },
              }),
            ]}
          >
            <Input.Password className={styles.inputPassword} style={{ marginBottom: '1rem' }} />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}
          >
            {({ getFieldValue }) => this._renderButton(getFieldValue)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default ResetPassword;
