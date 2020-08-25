import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Input, Button } from 'antd';
import router from 'umi/router';
import s from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading, sendemail: { companyinfo: datainfo } }) => ({
  datainfo,
  submitting: loading.effects['sendemail/newPW'],
}))
class ResetPassword extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params: { code = '' } = {} },
    } = this.props;
    const data = { code };
    dispatch({ type: 'sendemail/getcompanyInfo', payload: data });
  }

  check = (rule, value, callback) => {
    const { form } = this.props;
    if (value.trim() === '') {
      callback(formatMessage({ id: 'global.required.password' }));
    } else if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'global.required.comnfirmpassword' }));
    }
    callback();
  };

  handleSubmit = e => {
    const {
      dispatch,
      form,
      match: { params: { code = '' } = {} },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { password = '' } = values;
        const data = { password, code };
        dispatch({ type: 'sendemail/newPW', payload: data });
      }
    });
  };

  change = () => {
    router.push('/login');
  };

  render() {
    const {
      datainfo,
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { user = {} } = datainfo;
    const { company = {} } = user;

    return (
      <Row type="flex" justify="space-around" align="middle">
        <Form className={s.from} onSubmit={this.handleSubmit}>
          <p className={s.title}> {formatMessage({ id: 'reset-password.reset-password' })}</p>
          <p className={s.Subtitle}>
            {formatMessage({ id: 'reset-password.please-enter-the-new-password' })}
          </p>
          <Row type="flex" justify="space-around">
            <div className={s.inputResetpw}>
              <div className={s.companycode}>
                <FormItem
                  label={
                    <span className={s.inputLabel}>
                      {formatMessage({ id: 'forgot-password.company-name' })}
                    </span>
                  }
                >
                  {getFieldDecorator('name', {
                    initialValue: company ? company.name : '',
                  })(<Input disabled style={{ width: '200%', marginTop: '-5px' }} />)}
                </FormItem>
                <FormItem
                  label={
                    <span className={s.inputLabel}>
                      {formatMessage({ id: 'forgot-password.reset.company-code' })}
                    </span>
                  }
                >
                  {getFieldDecorator('code', {
                    initialValue: company ? company.code : '',
                  })(<Input disabled style={{ width: '100%', marginTop: '-5px' }} />)}
                </FormItem>
              </div>

              <span className={s.inputLabel}>
                {formatMessage({ id: 'reset-password.new-password' })}
              </span>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'global.required.password' }),
                    },
                  ],
                  initialValue: '',
                })(<Input.Password />)}
              </FormItem>
              <span className={s.inputLabel}>
                {formatMessage({ id: 'reset-password.confirm-password' })}
              </span>
              <FormItem>
                {getFieldDecorator('confirmpassword', {
                  rules: [
                    {
                      validator: this.check,
                    },
                  ],
                  initialValue: '',
                })(<Input.Password />)}
              </FormItem>
            </div>
          </Row>
          <FormItem style={{ marginTop: '25px' }}>
            <div className={s.button}>
              <Button
                htmlType="submit"
                loading={submitting}
                style={{ width: '100%' }}
                size="large"
                type="primary"
              >
                {formatMessage({ id: 'reset-password.update' }).toUpperCase()}
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
                {formatMessage({ id: 'reset-password.cancel' }).toUpperCase()}
              </Button>
            </div>
          </FormItem>
        </Form>
      </Row>
    );
  }
}
export default ResetPassword;
