/* eslint-disable react/jsx-curly-newline */
import { EyeFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage, history, Link } from 'umi';
import { removeLocalStorage } from '@/utils/authority';
import logoGoogle from '@/assets/logo_google.png';
import styles from './index.less';
import { IS_TERRALOGIC_CANDIDATE_LOGIN, IS_TERRALOGIC_LOGIN } from '@/utils/login';

const FormLogin = (props) => {
  const {
    location,
    dispatch,
    loading = false,
    login: {
      messageError = '',
      isEmailError: isEmailErrorProp = false,
      isPasswordError: isPasswordErrorProp = false,
      urlGoogle = '',
      urlLollypop = '',
    } = {},
  } = props;

  const [form] = Form.useForm();
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  useEffect(() => {
    setIsEmailError(isEmailErrorProp);
    setIsPasswordError(isPasswordErrorProp);
  }, [isEmailErrorProp, isPasswordErrorProp]);

  useEffect(() => {
    // eslint-disable-next-line compat/compat
    const query = new URLSearchParams(location.search);
    const emailGet = query.get('email');
    if (emailGet) {
      form.setFieldsValue({
        userEmail: emailGet,
      });
    }
    removeLocalStorage();
    dispatch({ type: 'login/getURLGoogle' });
    dispatch({ type: 'login/getURLLollypop' });
    history.replace();
  }, []);

  const handleSubmit = (values) => {
    dispatch({
      type: 'login/login',
      payload: values,
    });
  };

  const onValuesChange = () => {
    dispatch({
      type: 'login/save',
      payload: {
        isEmailError: false,
        isPasswordError: false,
      },
    });
  };

  const onFinish = ({ userEmail, password, keepSignIn }) => {
    const payload = { email: userEmail, password, keepSignIn };
    handleSubmit(payload);
  };

  const _renderButton = () => {
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

  const getLoginBoxText = () => {
    if (IS_TERRALOGIC_CANDIDATE_LOGIN)
      return ['Welcome Back', 'Enter your credentials to access your account.'];
    if (IS_TERRALOGIC_LOGIN)
      return ['Login to Portal', 'Enter your credentials to access your account.'];
    return ['Sign in to your account'];
  };

  const titleText = getLoginBoxText(IS_TERRALOGIC_LOGIN, IS_TERRALOGIC_CANDIDATE_LOGIN);

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
        onFinish={onFinish}
        requiredMark={false}
        onValuesChange={onValuesChange}
        form={form}
      >
        <Form.Item
          label={formatMessage({ id: 'pages.login.emailLabel' })}
          name="userEmail"
          // validateStatus={isEmailError ? 'error' : undefined}
          // help={isEmailError ? messageError : null}
          validateTrigger="onSubmit"
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
          <Input
            className={styles.inputEmail}
            placeholder="Enter your email"
            onChange={() =>
              form.setFieldsValue({ userEmail: (form.getFieldValue('userEmail') || '').trim() })
            }
            spellcheck="false"
          />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'pages.login.passwordLabel' })}
          name="password"
          validateTrigger="onSubmit"
          validateStatus={isPasswordError || isEmailError ? 'error' : undefined}
          help={isPasswordError || isEmailError ? messageError : null}
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
            placeholder="Enter your password"
            spellcheck="false"
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
          {({ getFieldValue }) => _renderButton(getFieldValue)}
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
};

export default connect(({ loading, login }) => ({
  loading: loading.effects['login/login'],
  login,
}))(FormLogin);
