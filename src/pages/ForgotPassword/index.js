import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Input, Button } from 'antd';
import router from 'umi/router';

import s from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading }) => ({
  submitting: loading.effects['sendemail/fetch'],
}))
class forgotPW extends React.PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.setFieldsValue({
      email: form.getFieldValue('email').trim(),
    });
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({ type: 'sendemail/fetch', payload: values });
      }
    });
  };

  change = () => {
    router.push('/login');
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Form className={s.from} onSubmit={this.handleSubmit}>
          <p className={s.title}> {formatMessage({ id: 'forgot-password.forgot-password' })}</p>
          <p className={s.Subtitle}>
            {formatMessage({ id: 'forgot-password.please-enter-your-email-to-reset-password' })}
          </p>
          <Row type="flex" justify="space-around">
            <div className={s.input}>
              <span className={s.inputLabel}>
                {formatMessage({ id: 'forgot-password.email-address' })}
              </span>
              <FormItem>
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
                  initialValue: '',
                })(<Input size="large" autoFocus />)}
              </FormItem>
            </div>
          </Row>
          <FormItem>
            <div className={s.button}>
              <Button
                htmlType="submit"
                loading={submitting}
                style={{ width: '100%' }}
                size="large"
                type="primary"
              >
                {formatMessage({ id: 'forgot-password.send' }).toUpperCase()}
              </Button>
            </div>
          </FormItem>
          <FormItem>
            <div className={s.buttonCancel}>
              <Button
                onClick={this.change}
                style={{ width: '100%', marginTop: '-5px' }}
                size="large"
                type="primary"
              >
                {formatMessage({ id: 'forgot-password.cancel' }).toUpperCase()}
              </Button>
            </div>
          </FormItem>
        </Form>
      </Row>
    );
  }
}
export default forgotPW;
