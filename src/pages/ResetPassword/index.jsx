import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { CheckCircleFilled, EyeFilled } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';

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
        {formatMessage({ id: 'pages.resetPassword.createPassword' })}
      </Button>
    );
  };

  render() {
    const arrText = [
      formatMessage({ id: 'pages.resetPassword.arrText1' }),
      formatMessage({ id: 'pages.resetPassword.arrText2' }),
    ];
    return (
      <div className={styles.formWrapper}>
        <p className={styles.formWrapper__title}>
          {formatMessage({ id: 'pages.resetPassword.title' })}
        </p>
        {arrText.map((item) => (
          <div style={{ marginBottom: '0.5rem' }}>
            <CheckCircleFilled style={{ color: '#13A951', marginRight: '10px' }} />
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
            label={formatMessage({ id: 'pages.resetPassword.passwordLabel' })}
            name="password"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'pages.resetPassword.pleaseInputYourNewPassword' }),
              },
              {
                min: 8,
                message: formatMessage({ id: 'pages.resetPassword.minimumCharacter' }),
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{0,}$/,
                message: formatMessage({ id: 'pages.resetPassword.passwordRules' }),
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
          <Form.Item
            label={formatMessage({ id: 'pages.resetPassword.confirmPasswordLabel' })}
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'pages.resetPassword.pleaseConfirmPassword' }),
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line compat/compat
                  return Promise.reject(
                    new Error(formatMessage({ id: 'pages.resetPassword.passwordNotMatch' })),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeFilled style={{ color: '#2c6df9' }} /> : <EyeFilled />
              }
              className={styles.inputPassword}
              style={{ marginBottom: '1rem' }}
            />
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
