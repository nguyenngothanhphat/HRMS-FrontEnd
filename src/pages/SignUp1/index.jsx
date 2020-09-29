import React, { useState, useEffect } from 'react';

import { connect } from 'umi';
import { Form, Input, Button, Checkbox } from 'antd';

import styles from './index.less';

const SignUp1 = (props) => {
  const [keepSignIn, setKeepSignIn] = useState(false);

  const [form] = Form.useForm();

  const { user, dispatch } = props;

  useEffect(() => {
    // console.log(props);
  }, []);

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
    const user = {
      firstName: fullname,
      email,
    };

    if (dispatch) {
      const { firstName = '', email = '' } = user;
      await dispatch({
        type: 'signup/fetchUserInfo',
        payload: {
          firstName,
          email,
        },
      });
    }

    storeData(user);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChange = (e) => {
    const isChecked = e.target.checked;
    setKeepSignIn(isChecked);
  };

  return (
    <div className={styles.wrapper}>
      <h2>Sign Up for your account</h2>

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
              pattern: /^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$/,
              message: 'Full name is not valid',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="keep-sign-in">
          <Checkbox checked={keepSignIn} onChange={onChange}>
            Keep me signed in
          </Checkbox>
        </Form.Item>

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
