import React, { useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Input, Button, Col } from 'antd';
import Link from 'umi/link';
import styles from './index.less';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const Step1Component = props => {
  const { form, dispatch, submitting, login: { email = '' } = {} } = props;
  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = form;
  const emailError = isFieldTouched('email') && getFieldError('email');
  const handleSubmit = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { email: emailInput } = values;
      dispatch({ type: 'login/fetchCompanyCode', payload: { email: emailInput } });
    });
  };

  useEffect(() => {
    form.validateFieldsAndScroll();
  }, []);

  return (
    <Row className={styles.step1Container}>
      <Form className={styles.step1FormWrapper}>
        <p className={styles.title}> {formatMessage({ id: 'signin.welcome-back' })}</p>
        <p className={styles.subtitle}>{formatMessage({ id: 'signin.please-enter-your-email' })}</p>
        <Row>
          <div className={styles.input}>
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
                  autoFocus
                />
              )}
            </Form.Item>
          </div>
        </Row>
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
              {formatMessage({ id: 'signin.continue' }).toUpperCase()}
            </Button>
          </div>
        </Form.Item>
        <Col span={12} className={styles.wrapSignUpLink}>
          <span className={styles.txtDontHave}>
            {formatMessage({ id: 'signin.dontHaveAccount' })}
          </span>
          <Link to="/signup" className={styles.su}>
            {formatMessage({ id: 'signin.signup' })}
          </Link>
        </Col>
      </Form>
    </Row>
  );
};

const Step1 = Form.create({ name: 'signin_step1_form' })(
  connect(({ loading, login }) => ({
    login,
    submitting: loading.effects['login/fetchCompanyCode'],
  }))(Step1Component)
);
export default Step1;
