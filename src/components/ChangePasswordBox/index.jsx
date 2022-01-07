import { LogoutOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Tooltip } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import CheckIcon from '@/assets/changePasswordCheck.svg';
import styles from './index.less';

const arrText = [
  'Use a minimum of 8 characters.',
  'Avoid common words and repetition (eg. password, 12121212)',
  'At least one letter, one number and special character!',
];
@connect(({ loading, changePassword: { statusChangePassword = false } }) => ({
  statusChangePassword,
  loading: loading.effects['changePassword/updatePassword'],
}))
class ChangePasswordBox extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  componentDidUpdate() {
    const { statusChangePassword, dispatch } = this.props;
    if (statusChangePassword === true) {
      dispatch({
        type: 'changePassword/save',
        payload: {
          statusChangePassword: false,
        },
      });
      setTimeout(() => {
        this.formRef.current.resetFields();
      }, 500);
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

  handleLogout = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  render() {
    const { onFinish = () => {}, showOption = false } = this.props;

    return (
      <div className={styles.ChangePasswordBox}>
        <Form
          className={styles.changePassword__form}
          layout="vertical"
          name="basic"
          ref={this.formRef}
          onFinish={onFinish}
          requiredMark={false}
        >
          <div className={styles.container}>
            <div className={styles.header}>
              <span className={styles.title}>Change your password</span>
              {showOption && (
                <Tooltip title="Logout">
                  <LogoutOutlined
                    onClick={this.handleLogout}
                    className={styles.icon}
                    style={{ marginLeft: '24px' }}
                  />
                </Tooltip>
              )}
            </div>
            <p className={styles.description}>
              To make your account secure, please create a new password
            </p>
            <div className={styles.titleAndDescription}>
              {arrText.map((item) => (
                <div key={item} style={{ marginBottom: '12px' }}>
                  <img src={CheckIcon} alt="" style={{ color: '#13A951', marginRight: '10px' }} />
                  <span className={styles.description}>{item}</span>
                </div>
              ))}
            </div>
            <Row className={styles.passwordContainer} gutter={['12', '12']}>
              <Col span={24}>
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
                    // {
                    //   min: 8,
                    //   message: formatMessage({
                    //     id: 'page.changePassword.rules.characters',
                    //   }),
                    // },
                    // {
                    //   pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{0,}$/,
                    //   message: formatMessage({
                    //     id: 'page.changePassword.rules.patterns',
                    //   }),
                    // },
                  ]}
                >
                  <Input.Password className={styles.inputPassword} />
                </Form.Item>
              </Col>
              <Col />
            </Row>
            <Row justify="space-between" className={styles.passwordContainer} gutter={['12', '12']}>
              <Col span={24}>
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
              <Col span={24}>
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
      </div>
    );
  }
}
export default ChangePasswordBox;
