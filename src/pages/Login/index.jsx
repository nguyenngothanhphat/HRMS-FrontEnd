import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { EyeFilled, GooglePlusOutlined } from '@ant-design/icons';
import GoogleLogin from 'react-google-login';
import { Link, connect, formatMessage } from 'umi';
import styles from './index.less';

@connect(({ loading, login: { messageError = '' } = {} }) => ({
  loading: loading.effects['login/login'],
  loadingLoginThirdParty: loading.effects['login/loginThirdParty'],
  messageError,
}))
class FormLogin extends Component {
  onFinish = ({ email, password }) => {
    const payload = { email, password };
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
    const { loadingLoginThirdParty, messageError = '' } = this.props;
    const checkValidationEmail = messageError === 'User not found' ? 'error' : undefined;
    const messageValidationEmail =
      messageError === 'User not found' ? 'User does not exist' : undefined;
    const checkValidationPsw = messageError === 'Invalid password' ? 'error' : undefined;
    const messageValidationPsw =
      messageError === 'Invalid password' ? 'Incorrect password. Try again' : undefined;
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
            validateStatus={checkValidationEmail}
            help={messageValidationEmail}
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
            <Input className={styles.inputEmail} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'pages.login.passwordLabel' })}
            name="password"
            validateStatus={checkValidationPsw}
            help={messageValidationPsw}
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
          {/* <Form.Item className={styles.checkbox} name="remember" valuePropName="checked">
            <Checkbox>
              <span>{formatMessage({ id: 'pages.login.keepMeSignedIn' })}</span>
            </Checkbox>
          </Form.Item> */}
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
