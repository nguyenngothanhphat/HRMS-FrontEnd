import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Col, Input, Button } from 'antd';
import s from './index.less';

const FormItem = Form.Item;

@Form.create()
class ChangePassword extends React.PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Row className={s.subForm} type="flex" justify="space-around" align="middle">
        <Col span={24}>
          <p className={s.title}> {formatMessage({ id: 'change-password.change-password' })}</p>
          <p className={s.Subtitle}>
            {formatMessage({ id: 'change-password.please-enter-the-new-password' })}
          </p>
          <Row type="flex" justify="space-around">
            <Form className={s.input}>
              <span className={s.inputLabel}>
                {formatMessage({ id: 'change-password.old-password' })}
              </span>
              <FormItem>
                {getFieldDecorator('oldpassword', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'global.required.password' }),
                    },
                  ],
                  initialValue: '',
                })(<Input type="password" size="large" />)}
              </FormItem>
              <span className={s.inputLabel}>
                {formatMessage({ id: 'change-password.new-password' })}
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
                })(<Input type="password" size="large" />)}
              </FormItem>
              <span className={s.inputLabel}>
                {formatMessage({ id: 'change-password.confirm-password' })}
              </span>
              <FormItem>
                {getFieldDecorator('Comfirmassword', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'global.required.password' }),
                    },
                  ],
                  initialValue: '',
                })(<Input type="password" size="large" />)}
              </FormItem>
            </Form>
          </Row>
          <FormItem>
            <div className={s.button}>
              <Button style={{ width: '100%' }} size="large" type="primary">
                {formatMessage({ id: 'change-password.update' }).toUpperCase()}
              </Button>
            </div>
          </FormItem>
          <FormItem>
            <div className={s.buttonCancel}>
              <Button style={{ width: '100%', marginTop: '-5px' }} size="large" type="primary">
                {formatMessage({ id: 'change-password.cancel' }).toUpperCase()}
              </Button>
            </div>
          </FormItem>
        </Col>
      </Row>
    );
  }
}
export default ChangePassword;
