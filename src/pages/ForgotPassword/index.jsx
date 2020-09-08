import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { Link, connect } from 'umi';
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
        <p className={styles.formWrapper__title}>Forgot Password</p>
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
            label="Enter company email address/ approved private email"
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
              <p className={styles.toLogin}>Sign in</p>
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
        Retrieve Password
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
          padding: '0 30px',
        }}
      >
        <img alt="" src={mail} style={{ color: '#eee', fontSize: '80px', marginBottom: '2rem' }} />
        <p className={styles.formWrapper__descriptionSuccessfully}>
          An email with the link to change your password was sent to the email id{' '}
          <span>{protectEmail}</span>. Click on the link to create new password
        </p>
      </div>
    );
  };

  render() {
    const { statusSendEmail } = this.props;
    return <>{!statusSendEmail ? this._renderForm() : this._renderSendSuccessfully()}</>;
  }
}

export default ForgotPassword;
