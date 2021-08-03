import React, { Component } from 'react';
import { Form, Input, Button, Col, Row, Spin } from 'antd';
import { connect } from 'umi';
import { CheckCircleFilled } from '@ant-design/icons';
import styles from './index.less';

@connect(({ loading, signup = {} }) => ({
  loading: loading.effects['signup/signupAdmin'],
  loadingActive: loading.effects['signup/loadingActive'],
  loadingLogin: loading.effects['login/login'],
  signup,
}))
class Screen3 extends Component {
  _renderButton = (getFieldValue) => {
    const valuePsw = getFieldValue('password');
    const valueConfirm = getFieldValue('confirmPassword');
    return (
      <Button type="primary" htmlType="submit" disabled={!valuePsw || !valueConfirm}>
        Create Password
      </Button>
    );
  };

  onFinish = (values) => {
    const { dispatch } = this.props;
    const { password } = values;
    const payload = this.processData(password);
    dispatch({
      type: 'signup/signupAdmin',
      payload,
    });
  };

  processData = (psw) => {
    const { signup = {} } = this.props;
    const {
      checkLegalSameHeadQuarter,
      codeNumber = '',
      company = {},
      headQuarterAddress = {},
      legalAddress = {},
      locations = [],
      user = {},
    } = signup;
    const defaultLocation = { name: 'Headquarter', headQuarterAddress, isHeadQuarter: true };
    const formatLocation = locations.map((location) => {
      const {
        name = '',
        addressLine1 = '',
        addressLine2,
        state = '',
        country = '',
        zipCode = '',
      } = location;
      return {
        name,
        headQuarterAddress: {
          addressLine1,
          addressLine2,
          state,
          country,
          zipCode,
        },
        isHeadQuarter: false,
      };
    });
    const payload = {
      codeNumber,
      company: {
        ...company,
        isSameAsHeadquarter: checkLegalSameHeadQuarter,
        headQuarterAddress,
        legalAddress,
      },
      locations: [defaultLocation, ...formatLocation],
      user: { ...user, password: psw },
    };
    return payload;
  };

  render() {
    const { loading, loadingActive, loadingLogin } = this.props;
    const loadingSignUp = loading || loadingActive || loadingLogin;
    const arrText = [
      'Use a minimum of 8 characters.',
      'Avoid common words and repetition (eg. password, 12121212)',
      'At least one letter, one number and special character!',
    ];
    return (
      <div className={styles.Screen3}>
        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          requiredMark={false}
        >
          <div className={styles.container}>
            <div className={styles.titleAndDescription}>
              <p className={styles.title}>
                Last but not least, secure your account with a password
              </p>
              {arrText.map((item) => (
                <div key={item} style={{ marginBottom: '18px' }}>
                  <CheckCircleFilled style={{ color: '#13A951', marginRight: '10px' }} />
                  <span className={styles.description}>{item}</span>
                </div>
              ))}
            </div>

            <Row className={styles.passwordContainer}>
              <Col xs={24} md={11}>
                <Form.Item
                  label="Enter password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                    {
                      min: 8,
                      message: 'Use a minimum of 8 characters.',
                    },
                    {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{0,}$/,
                      message: 'At least one letter, one number and special character!',
                    },
                  ]}
                >
                  <Input.Password className={styles.inputPassword} />
                </Form.Item>
              </Col>
              <Col xs={0} md={2} />
              <Col xs={24} md={11}>
                <Form.Item
                  label="Confirm password"
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: 'Please input confirm password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        // eslint-disable-next-line compat/compat
                        return Promise.reject(new Error('Passwords are not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password className={styles.inputPassword} />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className={styles.signInButton}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}
            >
              {({ getFieldValue }) => this._renderButton(getFieldValue)}
            </Form.Item>
          </div>
        </Form>
        {loadingSignUp && (
          <div className={styles.viewLoading}>
            <div className={styles.viewLoading__content}>
              <img
                src="/assets/images/setting_up_admin.png"
                alt="img_setting_up"
                className={styles.viewLoading__content__img}
              />
              <p className={styles.viewLoading__content__text}>Setting up your admin account</p>
              <Spin size="large" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Screen3;
