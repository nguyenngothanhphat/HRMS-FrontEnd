import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
// import { CheckCircleFilled } from '@ant-design/icons';
import { connect } from 'umi';

import styles from './index.less';

@connect(({ loading, changePassword: { statusSendEmail } = {} }) => ({
  loading: loading.effects['changePassword/forgotPassword'],
  statusSendEmail,
}))
class ResetPassword extends Component {
  check = (rule, value, callback) => {
    if (value.trim() === '') {
      callback('Please input your new password!');
      // } else if (value && value !== form.getFieldValue('password')) {
      //   callback(formatMessage({ id: 'global.required.comnfirmpassword' }));
    }
    callback();
  };

  onFinish = (values) => {
    // const { email } = values;
    // this.handleSubmit(email);
  };

  handleSubmit = (email) => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'changePassword/forgotPassword',
    //   payload: { email },
    // });
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
    return (
      <div className={styles.formWrapper}>
        <p className={styles.formWrapper__title}>Create New Password</p>
        <p className={styles.formWrapper__description}>
          In order to retrieve password, you must enter your registered company email id or private
          email id entered submitted with the HR.
        </p>
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
            label="Enter Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your new password!',
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
