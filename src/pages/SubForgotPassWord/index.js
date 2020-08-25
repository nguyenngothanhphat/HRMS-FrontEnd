import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Input, Button } from 'antd';
import router from 'umi/router';
import s from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading, sendemail: { listcode: listcompanycode, email: emaildata } }) => ({
  emaildata,
  listcompanycode,
  submitting: loading.effects['sendemail/changePW'],
}))
class SubforgotPW extends React.PureComponent {
  handleSubmit = e => {
    const { dispatch, form, emaildata = {}, listcompanycode = [] } = this.props;
    const newcode = listcompanycode;
    const { email } = emaildata;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { inputcode = '' } = values;
        const companyCode = listcompanycode.length === 1 ? newcode : inputcode;
        const data = { email, companyCode };
        dispatch({ type: 'sendemail/changePW', payload: data });
      }
    });
  };

  check = (rule, value, callback) => {
    const { listcompanycode = [] } = this.props;
    const checkArray = listcompanycode.includes(value);
    if (value.trim() === '') {
      callback(formatMessage({ id: 'global.required.companycode' }));
    } else if (value && !checkArray) {
      callback(formatMessage({ id: 'global.not.found.code' }));
    }
    callback();
  };

  change = () => {
    router.push('/forgot-password');
  };

  loginrouter = () => {
    router.push('/login');
  };

  render() {
    const {
      listcompanycode = [],
      emaildata = {},
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Form className={s.from}>
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
                  initialValue: emaildata.email,
                })(
                  <Input
                    disabled
                    size="large"
                    suffix={
                      <span className={s.edit} onClick={this.change}>
                        Edit
                      </span>
                    }
                    autoFocus
                  />
                )}
              </FormItem>

              {listcompanycode.length === 1 ? (
                true
              ) : (
                <div>
                  <span className={s.inputLabel}>
                    {formatMessage({ id: 'forgot-password.company-code' })}
                  </span>
                  <FormItem>
                    {getFieldDecorator('inputcode', {
                      rules: [
                        {
                          validator: this.check,
                        },
                      ],
                      initialValue: '',
                    })(<Input size="large" className={s.forgot_code} autoFocus />)}
                  </FormItem>
                </div>
              )}
            </div>
          </Row>
          <FormItem>
            <div className={s.button}>
              <Button
                htmlType="submit"
                onClick={this.handleSubmit}
                // loading={submitting}
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
                onClick={this.loginrouter}
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
export default SubforgotPW;
