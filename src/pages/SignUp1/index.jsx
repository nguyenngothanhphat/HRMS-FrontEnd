/* eslint-disable no-useless-escape */
import React from 'react';
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

  return (
    <div className={styles.wrapper}>
      <h2>
        {formatMessage({
          id: 'page.signUp.signUpHeader',
        })}
      </h2>

      <Form
        className={styles.form}
        name="sign-up"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label={formatMessage({
            id: 'page.signUp.enterCompanyAddress',
          })}
          name="email"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'page.signUp.inputEmailMsg',
              }),
            },
            {
              pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/,
              message: formatMessage({
                id: 'page.signUp.inputEmailInvalid',
              }),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className={styles.fullNameForm}
          label={formatMessage({
            id: 'page.signUp.enterFullName',
          })}
          name="fullname"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'page.signUp.inputFullNameMsg',
              }),
            },
            {
              pattern: /^[a-zA-Z ]*$/,
              message: formatMessage({
                id: 'page.signUp.inputFullNameInvalid',
              }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          {formatMessage({
            id: 'page.signUp.getStarted',
          })}
        </Button>
      </Form>
    </div>
  );
};

// export default SignUp1;
export default connect(({ signup: { user = {} } = {} }) => ({
  user,
}))(SignUp1);
