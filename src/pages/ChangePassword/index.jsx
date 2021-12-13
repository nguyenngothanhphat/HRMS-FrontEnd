/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Form, Input, Button, Col, Row, Affix } from 'antd';
import { connect, formatMessage } from 'umi';
import { CheckCircleFilled } from '@ant-design/icons';
import { PageContainer } from '@/layouts/layout/src';
import SecurityImage from '@/assets/changePassword.svg';
import styles from './index.less';

@connect(({ loading, changePassword: { statusChangePassword = false } }) => ({
  statusChangePassword,
  loading: loading.effects['changePassword/updatePassword'],
}))
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  componentDidUpdate() {
    const { statusChangePassword, dispatch } = this.props;
    if (statusChangePassword === true) {
      this.formRef.current.resetFields();
      dispatch({
        type: 'changePassword/save',
        payload: {
          statusChangePassword: false,
        },
      });
    }
  }

  _renderButton = (getFieldValue) => {
    const { loading } = this.props;
    const valuePsw = getFieldValue('newPassword');
    const valueConfirm = getFieldValue('confirmPassword');
    return (
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        disabled={!valuePsw || !valueConfirm || valuePsw !== valueConfirm}
      >
        {formatMessage({ id: 'page.changePassword' })}
      </Button>
    );
  };

  onFinish = (values) => {
    const { dispatch } = this.props;
    const payload = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    dispatch({
      type: 'changePassword/updatePassword',
      payload,
    });
  };

  render() {
    const arrText = [
      'Use a minimum of 8 characters.',
      'Avoid common words and repetition (eg. password, 12121212)',
      'At least one letter, one number and special character!',
    ];
    return (
      <PageContainer>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage_text}>Change Password</p>
          </div>
        </Affix>
        <div className={styles.changePassword}>
          <Form
            className={styles.changePassword__form}
            layout="vertical"
            name="basic"
            ref={this.formRef}
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
              <Row className={styles.passwordContainer} gutter={[16, 16]}>
                <Col xl={12} lg={18}>
                  <Form.Item
                    label={formatMessage({ id: 'page.changePassword.currentPassword' })}
                    name="currentPassword"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'page.changePassword.requiredCurrentPassword',
                        }),
                      },
                      {
                        min: 8,
                        message: formatMessage({
                          id: 'page.changePassword.rules.characters',
                        }),
                      },
                      {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{0,}$/,
                        message: formatMessage({
                          id: 'page.changePassword.rules.patterns',
                        }),
                      },
                    ]}
                  >
                    <Input.Password className={styles.inputPassword} />
                  </Form.Item>
                </Col>
                <Col />
              </Row>
              <Row className={styles.passwordContainer} gutter={[16, 16]}>
                <Col xl={12} lg={18}>
                  <Form.Item
                    label={formatMessage({ id: 'page.changePassword.newPassword' })}
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'page.changePassword.requiredNewPassword',
                        }),
                      },
                      {
                        min: 8,
                        message: formatMessage({
                          id: 'page.changePassword.rules.characters',
                        }),
                      },
                      {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{0,}$/,
                        message: formatMessage({
                          id: 'page.changePassword.rules.patterns',
                        }),
                      },
                    ]}
                  >
                    <Input.Password className={styles.inputPassword} />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={18}>
                  <Form.Item
                    label={formatMessage({ id: 'page.changePassword.confirmPassword' })}
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'page.changePassword.requiredCfmPassword',
                        }),
                      },
                      {
                        min: 8,
                        message: formatMessage({
                          id: 'page.changePassword.rules.characters',
                        }),
                      },
                      {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{0,}$/,
                        message: formatMessage({
                          id: 'page.changePassword.rules.patterns',
                        }),
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
            <img src={SecurityImage} alt="image_intranet" />
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default ChangePassword;
