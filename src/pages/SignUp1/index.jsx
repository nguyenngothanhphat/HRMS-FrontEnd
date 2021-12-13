/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import { formatMessage, connect, history } from 'umi';
import { Form, Input, Button } from 'antd';
import EmailExistModal from './EmailExistModal';
import styles from './index.less';

const SignUp1 = (props) => {
  const [form] = Form.useForm();

  const { dispatch, loadingSignUp } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isContinue, setIsContinue] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  React.useEffect(() => {
    if (isContinue) {
      form.validateFields();
    }
  }, [isContinue]);

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
    const { email = '', firstName = '', middleName = '', lastName = '' } = values;

    const payload = {
      firstName,
      middleName,
      lastName,
      email,
    };

    if (dispatch) {
      const res = await dispatch({
        type: 'signup/fetchUserInfo',
        payload,
      });
      const { statusCode } = res;
      if (statusCode === 400) {
        setIsVisible(true);
      }
    }

    storeData(payload);
  };

  const emailValidator = (rule, value, callback) => {
    if (isContinue) callback('Please input new email');
    else callback();
  };

  const onContinue = () => {
    setIsContinue(true);
    setIsVisible(false);
  };

  const onLogin = () => {
    history.push({
      pathname: `/login`,
      state: { autoFillEmail: currentEmail },
    });
  };

  const onEmailChange = (e) => {
    setCurrentEmail(e.target.value);
    setIsContinue(false);
  };

  return (
    <div className={styles.wrapper}>
      <h2>
        {formatMessage({
          id: 'page.signUp.signUpHeader',
        })}
      </h2>

      <EmailExistModal visible={isVisible} onContinue={onContinue} onLogin={onLogin} />

      <Form
        className={styles.form}
        name="sign-up"
        form={form}
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
            { validator: emailValidator },
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
          <Input onChange={onEmailChange} />
        </Form.Item>

        <Form.Item
          className={styles.fullNameForm}
          label="Enter first name"
          name="firstName"
          rules={[
            {
              required: true,
              message: 'Please input your first name!',
            },
            {
              pattern: /^[a-zA-Z ]*$/,
              message: 'First name is invalid',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className={styles.fullNameForm}
          label="Enter middle name"
          name="middleName"
          rules={[
            {
              pattern: /^[a-zA-Z ]*$/,
              message: 'Middle name is invalid',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className={styles.fullNameForm}
          label="Enter last name"
          name="lastName"
          rules={[
            {
              required: true,
              message: 'Please input your last name!',
            },
            {
              pattern: /^[a-zA-Z ]*$/,
              message: 'Last name is invalid',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Button loading={loadingSignUp} type="primary" htmlType="submit">
          {formatMessage({
            id: 'page.signUp.getStarted',
          })}
        </Button>
      </Form>
    </div>
  );
};

// export default SignUp1;
export default connect(({ loading, signup: { user = {} } = {} }) => ({
  user,
  loadingSignUp: loading.effects['signup/fetchUserInfo'],
}))(SignUp1);
