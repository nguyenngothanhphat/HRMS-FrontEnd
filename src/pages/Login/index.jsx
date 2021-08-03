/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { EyeFilled } from '@ant-design/icons';
import logoGoogle from '@/assets/logo_google.png';
import GoogleLogin from 'react-google-login';
import { Link, connect, formatMessage, history } from 'umi';
import { removeLocalStorage } from '@/utils/authority';

import styles from './index.less';

@connect(({ loading, login: { messageError = '' } = {} }) => ({
  loading: loading.effects['login/login'],
  loadingLoginThirdParty: loading.effects['login/loginThirdParty'],
  messageError,
}))
class FormLogin extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      checkValidationEmail: undefined,
      isMessageValidationEmail: true,
    };
  }

  componentDidMount = () => {
    const { location: { state: { autoFillEmail = '' } = {} } = {} } = this.props;
    removeLocalStorage();
    this.formRef.current.setFieldsValue({
      email: autoFillEmail,
    });
    history.replace();
  };

  onFinish = ({ email, password }) => {
    const payload = { email, password };
    this.handleSubmit(payload);
  };

  handleSubmit = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: { ...values },
    }).then(() => {
      const { messageError = '' } = this.props;

      const checkValidationEmail =
        messageError === 'User not found' || messageError === 'Invalid user' ? 'error' : undefined;

      this.setState({ checkValidationEmail, isMessageValidationEmail: true });
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

  returnMessageValidationEmail = (messageError) => {
    if (messageError === 'User not found') return 'User does not exist';
    if (messageError === 'Invalid user') return 'Invalid user';
    return undefined;
  };

  onValuesChange = (values) => {
    const { checkValidationEmail } = this.state;
    if (checkValidationEmail === 'error' && values) {
      this.setState({ isMessageValidationEmail: false, checkValidationEmail: undefined });
    }
  };

  render() {
    const { loadingLoginThirdParty, messageError = '' } = this.props;
    const { checkValidationEmail, isMessageValidationEmail } = this.state;

    const messageValidationEmail = this.returnMessageValidationEmail(messageError);

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
          onValuesChange={this.onValuesChange}
          requiredMark={false}
          ref={this.formRef}
        >
          <Form.Item
            label={formatMessage({ id: 'pages.login.emailLabel' })}
            name="email"
            validateStatus={checkValidationEmail}
            help={isMessageValidationEmail ? messageValidationEmail : null}
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
          <Form.Item className={styles.checkbox} name="remember">
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
          <div className={styles.textOr}>or sign in with</div>
          <GoogleLogin
            clientId="569320903794-k9h03nao8e8sq4mm6tq5rv5enjs0dlo6.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                type="primary"
                className={styles.btnSignInGG}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                loading={loadingLoginThirdParty}
              >
                <img src={logoGoogle} alt="logo" />
                <span>Login with Google</span>
              </Button>
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
