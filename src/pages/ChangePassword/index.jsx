/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Form, Input, Button, Col, Row, Affix } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { CheckCircleFilled } from '@ant-design/icons';
import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['changePassword/resetPassword'],
}))
class ChangePassword extends Component {
  _renderButton = (getFieldValue) => {
    const valuePsw = getFieldValue('newPassword');
    const valueConfirm = getFieldValue('confirmPassword');
    return (
      <Button
        type="primary"
        htmlType="submit"
        disabled={!valuePsw || !valueConfirm || valuePsw !== valueConfirm}
      >
        Change Password
      </Button>
    );
  };

  //   onFinish = (values) => {
  //     console.log('values', values);

  //   };

  processData = (psw) => {
    const { signup = {} } = this.props;
    const {
      codeNumber = '',
      company = {},
      headQuarterAddress = {},
      legalAddress = {},
      locations = [],
      user = {},
    } = signup;
    const payload = {
      codeNumber,
      company: { ...company, headQuarterAddress, legalAddress },
      locations,
      user: { ...user, password: psw },
    };
    return payload;
  };

  render() {
    const arrText = [
      'Use a minimum of 8 characters.',
      'Avoid common words and repetition (eg. password, 12121212)',
      'Avoid keyboard patterns (eg. Asdf )',
    ];
    return (
      <PageContainer>
        <Affix offsetTop={40}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage_text}>Change Password</p>
          </div>
        </Affix>
        <div className={styles.changePassword}>
          <Form
            className={styles.changePassword__form}
            layout="vertical"
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            requiredMark={false}
            style={{ marginTop: '1rem' }}
          >
            <div className={styles.container}>
              <div className={styles.titleAndDescription}>
                {arrText.map((item) => (
                  <div key={item} style={{ marginBottom: '18px' }}>
                    <CheckCircleFilled style={{ color: '#13A951', marginRight: '10px' }} />
                    <span className={styles.description}>{item}</span>
                  </div>
                ))}
              </div>
              <Row className={styles.passwordContainer} gutter={[16, 50]}>
                <Col xl={12} lg={18}>
                  <Form.Item
                    label="Current password"
                    name="currentPassword"
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
                        message: 'Avoid keyboard patterns (eg. Asdf )',
                      },
                    ]}
                  >
                    <Input.Password className={styles.inputPassword} />
                  </Form.Item>
                </Col>
                <Col />
              </Row>
              <Row className={styles.passwordContainer} gutter={[16, 50]}>
                <Col xl={12} lg={18}>
                  <Form.Item
                    label="New password"
                    name="newPassword"
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
                        message: 'Avoid keyboard patterns (eg. Asdf )',
                      },
                    ]}
                  >
                    <Input.Password className={styles.inputPassword} />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={18}>
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
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords are not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password className={styles.inputPassword} />
                  </Form.Item>
                </Col>
              </Row>
              <div className={styles.changePasswordButton}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}
                >
                  {({ getFieldValue }) => this._renderButton(getFieldValue)}
                </Form.Item>
              </div>
            </div>
          </Form>
          <div className={styles.changePassword__image}>
            <img src="/assets/images/Intranet_01@3x.png" alt="image_intranet" />
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default ChangePassword;
