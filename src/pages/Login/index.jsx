/* eslint-disable react/jsx-curly-newline */
import { EyeFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import React, { Component } from 'react';
// import GoogleLogin from 'react-google-login';
import { connect, formatMessage, history, Link } from 'umi';
import { removeLocalStorage } from '@/utils/authority';
import logoGoogle from '@/assets/logo_google.png';
import styles from './index.less';
import { IS_TERRALOGIC_CANDIDATE_LOGIN, IS_TERRALOGIC_LOGIN } from '@/utils/login';

@connect(({ loading, login: { messageError = '', urlGoogle = '', urlLollypop = '' } = {} }) => ({
  loading: loading.effects['login/login'],
  messageError,
  urlGoogle,
  urlLollypop,
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
    const { location, dispatch } = this.props;
    const query = new URLSearchParams(location.search);
    const email = query.get('email');

    if (email) {
      this.formRef.current.setFieldsValue({
        userEmail: email,
      });
    }
    removeLocalStorage();
    dispatch({ type: 'login/getURLGoogle' });
    dispatch({ type: 'login/getURLLollypop' });
    // this.formRef.current.setFieldsValue({
    //   email: autoFillEmail,
    // });
    history.replace();
  };

  onFinish = ({ userEmail: email, password, keepSignIn }) => {
    const payload = { email, password, keepSignIn };
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

  _renderButton = () => {
    const { loading } = this.props;
    // const valueEmail = getFieldValue('userEmail');
    // const valuePsw = getFieldValue('password');
    return (
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        // disabled={!valueEmail || !valuePsw}
        className={styles.btnSignIn}
      >
        {formatMessage({ id: 'pages.login.signIn' })}
      </Button>
    );
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

  checkBoxValue = (emailsLocalStr, passwordLocalStr) => {
    let checkedBox = false;
    if (emailsLocalStr && passwordLocalStr) {
      checkedBox = true;
    }

    return checkedBox;
  };

  getLoginBoxText = () => {
    if (IS_TERRALOGIC_CANDIDATE_LOGIN)
      return ['Welcome Back', 'Enter your credentials to access your account.'];
    if (IS_TERRALOGIC_LOGIN)
      return ['Login to Portal', 'Enter your credentials to access your account.'];
    return ['Sign in to your account'];
  };

  render() {
    const { messageError = '', urlGoogle = '', urlLollypop = '' } = this.props;
    const { checkValidationEmail, isMessageValidationEmail } = this.state;

    const messageValidationEmail = this.returnMessageValidationEmail(messageError);

    const checkValidationPsw = messageError === 'Invalid password' ? 'error' : undefined;
    const messageValidationPsw =
      messageError === 'Invalid password' ? 'Incorrect password. Try again' : undefined;

    const titleText = this.getLoginBoxText(IS_TERRALOGIC_LOGIN, IS_TERRALOGIC_CANDIDATE_LOGIN);
    return (
      <div className={styles.formWrapper}>
        <p
          className={styles.formWrapper__title}
          style={IS_TERRALOGIC_LOGIN || IS_TERRALOGIC_CANDIDATE_LOGIN ? { fontSize: '24px' } : {}}
        >
          {titleText[0]}
        </p>
        {titleText.length > 1 && <p className={styles.formWrapper__description}>{titleText[1]}</p>}
        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            keepSignIn: false,
          }}
          onFinish={this.onFinish}
          onValuesChange={this.onValuesChange}
          requiredMark={false}
          ref={this.formRef}
        >
          <Form.Item
            label={formatMessage({ id: 'pages.login.emailLabel' })}
            name="userEmail"
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
          <div className={styles.keepSignIn}>
            <Form.Item className={styles.checkbox} name="keepSignIn" valuePropName="checked">
              <Checkbox>
                <span>{formatMessage({ id: 'pages.login.keepMeSignedIn' })}</span>
              </Checkbox>
            </Form.Item>
            {/* {IS_TERRALOGIC_LOGIN && (
              <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                {formatMessage({ id: 'pages.login.forgotPassword' })}
              </Link>
            )} */}
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.userEmail !== currentValues.userEmail ||
              prevValues.password !== currentValues.password
            }
          >
            {({ getFieldValue }) => this._renderButton(getFieldValue)}
          </Form.Item>
          {!IS_TERRALOGIC_CANDIDATE_LOGIN && (
            <>
              {IS_TERRALOGIC_LOGIN ? (
                <div className={styles.textOr}>or</div>
              ) : (
                <div className={styles.textOr}>or sign in with</div>
              )}
              <a href={urlGoogle}>
                <Button type="primary" className={styles.btnSignInGG}>
                  <img src={logoGoogle} alt="logo" />
                  <span>Terralogic Login</span>
                </Button>
              </a>
              <a href={urlLollypop}>
                <Button type="primary" className={styles.btnSignInLollypop}>
                  <img src={logoGoogle} alt="logo" />
                  <span>Lollypop Login</span>
                </Button>
              </a>
              {!IS_TERRALOGIC_LOGIN && (
                <Link to="/forgot-password">
                  <p className={styles.forgotPassword}>
                    {formatMessage({ id: 'pages.login.forgotPassword' })}
                  </p>
                </Link>
              )}
            </>
          )}
        </Form>
      </div>
    );
  }
}

export default FormLogin;
