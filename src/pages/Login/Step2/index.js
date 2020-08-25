import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Row, Input, Button, Col, Checkbox, notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import Crypto from '@/utils/Crypto';
import styles from './index.less';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const Step2Component = props => {
  const { form, submitting, dispatch, login: { email, companyCode = [] } = {} } = props;
  const { getFieldDecorator, getFieldsError, isFieldTouched, getFieldError } = form;
  const emailError = isFieldTouched('email') && getFieldError('email');
  const passError = isFieldTouched('password') && getFieldError('password');
  const companyCodeError = isFieldTouched('companycodeinput') && getFieldError('companycodeinput');
  const getLoginInfo = () => {
    let rememberLogin = localStorage.getItem('rememberLogin');
    if (rememberLogin) {
      rememberLogin = JSON.parse(rememberLogin);
    }
    const {
      email: emailLS = '',
      password: passwordLS = '',
      remember: rememberLS = false,
      companycode: companyCodeLS = '',
    } = rememberLogin || {};
    return {
      ...(emailLS ? { emailLS: Crypto.decrypt(emailLS) } : ''),
      ...(passwordLS ? { passwordLS: Crypto.decrypt(passwordLS) } : ''),
      ...(companyCodeLS ? { companyCodeLS: Crypto.decrypt(companyCodeLS) } : ''),
      rememberLS,
    };
  };
  const handleSubmit = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { password = '', remember = false, companycodeinput } = values;
      const data = { email, password };
      if (companyCode.length > 1) {
        if (companyCode.indexOf(companycodeinput) !== -1) {
          data.companyCode = companycodeinput;
        } else {
          notification.error({
            message: formatMessage({ id: 'signin.companyCodeNotExist' }),
            description: formatMessage({ id: 'signin.companyCodeNotExistDes' }),
          });
          return;
        }
      } else {
        [data.companyCode] = companyCode;
      }
      if (remember) {
        const encryptData = {
          ...(email ? { email: Crypto.encrypt(email) } : ''),
          ...(password ? { password: Crypto.encrypt(password) } : ''),
          ...(companycodeinput ? { companycode: Crypto.encrypt(companycodeinput) } : ''),
          remember: true,
        };
        localStorage.setItem('rememberLogin', JSON.stringify(encryptData));
      } else {
        localStorage.setItem('rememberLogin', JSON.stringify({ remember: false }));
      }
      dispatch({ type: 'login/signin', payload: data });
    });
  };
  const backStep1 = () => {
    dispatch({ type: 'login/backstep1', payload: { companyCode: [], email } });
  };
  useEffect(() => {
    const rememberLogin = getLoginInfo();
    const { passwordLS, rememberLS, companyCodeLS } = rememberLogin;
    form.setFieldsValue({
      password: passwordLS,
      remember: rememberLS,
      companycodeinput: companyCodeLS,
    });
    form.validateFieldsAndScroll();
  }, []);
  return (
    <Row className={styles.step2Container}>
      <Form className={styles.step2FormWrapper}>
        <p className={styles.title}> {formatMessage({ id: 'signin.title' })}</p>
        <p className={styles.subtitle}>
          {companyCode > 1 ? (
            <React.Fragment>
              {formatMessage({ id: 'signin.enterCompanyCodePassword' })}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {formatMessage({ id: 'signin.please-enter-your-password' })}
            </React.Fragment>
          )}
        </p>
        <Row>
          <span className={styles.inputLabel}>{formatMessage({ id: 'signin.email' })}</span>
          <Form.Item
            style={{ marginTop: 7 }}
            validateStatus={emailError ? 'error' : ''}
            help={emailError || ''}
          >
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'global.required.email' }),
                },
                {
                  type: 'email',
                  message: formatMessage({ id: 'global.isEmail.email' }),
                },
              ],
              initialValue: email,
            })(
              <Input
                placeholder={formatMessage({ id: 'signin.workemail' })}
                size="large"
                readOnly
                suffix={
                  <span className={styles.link} onClick={backStep1}>
                    {formatMessage({ id: 'signin.edit' })}
                  </span>
                }
              />
            )}
          </Form.Item>
          {companyCode.length > 1 && (
            <React.Fragment>
              <span className={styles.inputLabel}>
                {formatMessage({ id: 'signin.companycode' })}*
              </span>
              <Form.Item
                style={{ marginTop: 7 }}
                validateStatus={companyCodeError ? 'error' : ''}
                help={companyCodeError || ''}
              >
                {getFieldDecorator('companycodeinput', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'global.required.companycode' }),
                    },
                  ],
                  initialValue: '',
                })(
                  <Input
                    className={styles.signin_companyCode}
                    placeholder={formatMessage({ id: 'signin.companycode' })}
                    size="large"
                  />
                )}
              </Form.Item>
            </React.Fragment>
          )}
          <span className={styles.inputLabel}>{formatMessage({ id: 'signin.password' })}*</span>
          <Form.Item
            style={{ marginTop: 7, marginBottom: 0 }}
            validateStatus={passError ? 'error' : ''}
            help={passError || ''}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'global.required.password' }),
                },
              ],
              initialValue: '',
            })(<Input.Password size="large" />)}
          </Form.Item>
        </Row>
        <div className={styles.scheck}>
          <Form.Item style={{ marginBottom: 10 }}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>
                <span className={styles.labelFW}>
                  {formatMessage({ id: 'signin.keep-me-logged-in' })}
                </span>
              </Checkbox>
            )}
          </Form.Item>
          <Form.Item style={{ marginBottom: 10 }}>
            <Link to="/forgot-password" className={styles.labelFW}>
              {formatMessage({ id: 'signin.forgot-password' })}
            </Link>
          </Form.Item>
        </div>
        <Form.Item style={{ marginBottom: 15 }}>
          <div className={styles.button}>
            <Button
              htmlType="submit"
              onClick={handleSubmit}
              className={styles.submitBtn}
              style={{ width: '100%' }}
              size="large"
              disabled={hasErrors(getFieldsError())}
              loading={submitting}
              type="primary"
            >
              {formatMessage({ id: 'signin.title' }).toUpperCase()}
            </Button>
          </div>
        </Form.Item>
        <Col span={12} className={styles.wrapSignUpLink}>
          <span className={styles.txtDontHave}>
            {formatMessage({ id: 'signin.dontHaveAccount' })}
          </span>
          <Link to="/signup" className={styles.link}>
            {formatMessage({ id: 'signin.signup' })}
          </Link>
        </Col>
      </Form>
    </Row>
  );
};

const Step2 = Form.create({ name: 'signin_step2_form' })(
  connect(({ loading, login }) => ({ login, submitting: loading.effects['login/signin'] }))(
    Step2Component
  )
);
export default Step2;
