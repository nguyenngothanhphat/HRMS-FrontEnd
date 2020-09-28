import React from 'react';
import { Form, Input, Button, Col, Row } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import styles from './index.less';

const Screen3 = () => {
  const onFinish = (values) => {
    const { password } = values;
    console.log('SIGN UP, PASSWORD: ', password);
  };

  const _renderButton = (getFieldValue) => {
    const valuePsw = getFieldValue('password');
    const valueConfirm = getFieldValue('confirmPassword');
    return (
      <Button type="primary" htmlType="submit" disabled={!valuePsw || !valueConfirm}>
        Sign up
      </Button>
    );
  };

  const arrText = [
    'Use a minimum of 8 characters.',
    'Avoid common words and repetition (eg. password, 12121212)',
    'Avoid keyboard patterns (eg. Asdf )',
  ];

  return (
    <div className={styles.Screen3}>
      <div className={styles.container}>
        <div className={styles.titleAndDescription}>
          <p className={styles.title}>Last but not least, secure your account with a password</p>
          {arrText.map((item) => (
            <div style={{ marginBottom: '18px' }}>
              <CheckCircleFilled style={{ color: '#13A951', marginRight: '10px' }} />
              <span className={styles.description}>{item}</span>
            </div>
          ))}
        </div>

        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          requiredMark={false}
          style={{ marginTop: '1rem' }}
        >
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
                    message: 'Avoid keyboard patterns (eg. Asdf )',
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
        </Form>
      </div>
      <div className={styles.signInButton}>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}
        >
          {({ getFieldValue }) => _renderButton(getFieldValue)}
        </Form.Item>
      </div>
    </div>
  );
};

export default Screen3;
