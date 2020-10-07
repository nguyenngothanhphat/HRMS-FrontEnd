import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { EyeFilled, GooglePlusOutlined } from '@ant-design/icons';
import GoogleLogin from 'react-google-login';
import { Link, connect, formatMessage } from 'umi';
import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['login/login'],
  loadingLoginThirdParty: loading.effects['login/loginThirdParty'],
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
        className={styles.btnSignIn}
      >
        {formatMessage({ id: 'pages.login.signIn' })}
      </Button>
    );
  };

  responseGoogle = (response) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/loginThirdParty',
      payload: response,
    });
  };

  render() {
    const { loadingLoginThirdParty } = this.props;
    return (
      <div className={styles.formWrapper}>
        <p className={styles.formWrapper__title}>
          {formatMessage({ id: 'pages.login.signInToYourAccount' })}
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
            label={formatMessage({ id: 'pages.login.emailLabel' })}
            name="email"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'pages.login.pleaseInputYourEmail' }),
              },
              {
                type: 'email',
                message: formatMessage({ id: 'pages.login.invalidEmail' }),
              },
            ]}
          >
            <Input className={styles.InputEmail} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'pages.login.passwordLabel' })}
            name="password"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'pages.login.pleaseInputYourPassword' }),
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
              <span>{formatMessage({ id: 'pages.login.keepMeSignedIn' })}</span>
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
          <div className={styles.textOr}>Or</div>
          <GoogleLogin
            clientId="979138479820-7hv5jn95k39tb42ltiscoi552ce9i2an.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                type="primary"
                className={styles.btnSignInGG}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                icon={<GooglePlusOutlined style={{ fontSize: '26px' }} />}
                loading={loadingLoginThirdParty}
              />
            )}
            onSuccess={this.responseGoogle}
          />
          <Link to="/forgot-password">
            <p className={styles.forgotPassword}>
              {formatMessage({ id: 'pages.login.forgotPassword' })}
            </p>
          </Link>
        </Form>
      </div>
    );
  }
}

export default FormLogin;
