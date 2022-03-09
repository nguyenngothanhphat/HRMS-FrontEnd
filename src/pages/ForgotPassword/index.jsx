import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { Link, connect, formatMessage } from 'umi';
import { IS_TERRALOGIC_CANDIDATE_LOGIN, IS_TERRALOGIC_LOGIN } from '@/utils/login';
import mail from './asset/mail-art.png';
import styles from './index.less';

@connect(({ loading, changePassword: { statusSendEmail } = {} }) => ({
  loading: loading.effects['changePassword/forgotPassword'],
  statusSendEmail,
}))
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'changePassword/save',
      payload: { statusSendEmail: false },
    });
  }

  onFinish = (values) => {
    const { email } = values;
    this.handleSubmit(email);
  };

  handleSubmit = (email) => {
    const { dispatch } = this.props;
    this.setState({ email });
    dispatch({
      type: 'changePassword/forgotPassword',
      payload: { email },
    });
  };

  _renderForm = () => {
    return (
      <div className={styles.formWrapper}>
        <p
          className={styles.formWrapper__title}
          style={IS_TERRALOGIC_LOGIN || IS_TERRALOGIC_CANDIDATE_LOGIN ? { fontSize: '24px' } : {}}
        >
          {formatMessage({ id: 'pages.forgotPassword.title' })}
        </p>
        <p className={styles.formWrapper__description}>
          {formatMessage({ id: 'pages.forgotPassword.description' })}
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
            label={formatMessage({ id: 'pages.forgotPassword.emailLabel' })}
            name="email"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'pages.forgotPassword.pleaseInputYourEmail' }),
              },
              {
                type: 'email',
                message: formatMessage({ id: 'pages.forgotPassword.invalidEmail' }),
              },
            ]}
          >
            <Input style={{ marginBottom: '0.5rem' }} />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.email !== currentValues.email}
          >
            {({ getFieldValue }) => this._renderButton(getFieldValue)}
          </Form.Item>
          <Form.Item>
            <Link to="/login">
              <p className={styles.toLogin}>
                {formatMessage({ id: 'pages.forgotPassword.signIn' })}
              </p>
            </Link>
          </Form.Item>
        </Form>
      </div>
    );
  };

  _renderButton = (getFieldValue) => {
    const { loading } = this.props;
    const valueEmail = getFieldValue('email');
    return (
      <Button type="primary" htmlType="submit" loading={loading} disabled={!valueEmail}>
        {formatMessage({ id: 'pages.forgotPassword.retrievePassword' })}
      </Button>
    );
  };

  hiddenEmail = (email) => {
    const splitted = email.split('@');
    let [part1] = splitted;
    part1 = part1.substring(0, 3);
    const [, part2] = splitted;
    // const lenghtHidden = part1.length - 3;
    return `${part1}******@${part2}`;
  };

  _renderSendSuccessfully = () => {
    const { email } = this.state;
    const protectEmail = this.hiddenEmail(email);
    return (
      <div
        className={styles.formWrapper}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <img alt="" src={mail} style={{ color: '#eee', fontSize: '80px', marginBottom: '2rem' }} />
        <p className={styles.formWrapper__descriptionSuccessfully}>
          {formatMessage({ id: 'pages.forgotPassword.descriptionSuccessfully1' })}
          <span>{protectEmail}</span>
          {formatMessage({ id: 'pages.forgotPassword.descriptionSuccessfully2' })}
        </p>
        <Link to="/login" className={styles.textSignIn}>
          Sign in
        </Link>
      </div>
    );
  };

  _renderBlockForm = () => {
    return (
      <div
        className={styles.formWrapper}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <p className={styles.formWrapper__descriptionSuccessfully}>
          You are not allowed to use this feature.
        </p>
        <Link to="/login" className={styles.textSignIn}>
          Sign in
        </Link>
      </div>
    );
  };

  render() {
    const { statusSendEmail } = this.props;
    // terralogic user cannot change/reset password, only use Google Signin (ticket #852 - gitlab)
    if (IS_TERRALOGIC_LOGIN) {
      return this._renderBlockForm();
    }
    return <>{!statusSendEmail ? this._renderForm() : this._renderSendSuccessfully()}</>;
  }
}

export default ForgotPassword;
