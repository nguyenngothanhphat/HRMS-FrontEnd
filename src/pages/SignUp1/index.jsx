/* eslint-disable no-useless-escape */
import React, { useEffect } from 'react';

import { formatMessage, connect } from 'umi';
import { Form, Input, Button } from 'antd';

import styles from './index.less';

const SignUp1 = (props) => {
  const { dispatch } = props;

  const storeData = (user) => {
    if (dispatch) {
      dispatch({
        type: 'signup/save',
        payload: {
          user,
        },
      });
    }
  };

  const onFinish = async (values) => {
    const { email, fullname } = values;

    if (dispatch) {
      await dispatch({
        type: 'signup/fetchUserInfo',
        payload: {
          firstName: fullname,
          email,
        },
      });
    }

    storeData({
      firstName: fullname,
      email,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed :', errorInfo);
  };

  return (
    <div className={styles.wrapper}>
      <h2>{formatMessage({ id: 'pages.login.signIn' })}</h2>
      <h2>{formatMessage({ id: 'pages.signUp.signUpHeader' })}</h2>

      <Form
        className={styles.form}
        name="sign-up"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Enter company email address"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            {
              pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/,
              message: 'Email is not valid',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className={styles.fullNameForm}
          label="Enter full name"
          name="fullname"
          rules={[
            { required: true, message: 'Please input your full name!' },
            {
              pattern: /^[a-zA-Z ]*$/,
              message: 'Full name is not valid',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item name="keep-sign-in">
          <Checkbox checked={keepSignIn} onChange={onChange}>
            Keep me signed in
          </Checkbox>
        </Form.Item> */}

        <Button type="primary" htmlType="submit">
          get started
        </Button>
      </Form>
    </div>
  );
};

// export default SignUp1;
export default connect(({ signup: { user = {} } = {} }) => ({
  user,
}))(SignUp1);
