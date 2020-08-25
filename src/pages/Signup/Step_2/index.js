import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Col } from 'antd';
import { isEmail, isPhone } from '@/utils/utils';
import SignUpInput from '../components/Input';
import SignUpBtn from '../components/Button';
import SignUpSteps from '../components/Steps';
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ signup }) => ({
  signup,
}))
@Form.create()
class Step02 extends React.Component {
  state = {
    finishing: false,
  };

  componentDidMount() {
    const { firstName = '', phone = '' } = this.props;
    if (firstName.length > 0 && phone.length > 0) {
      this.setState({
        finishing: true,
      });
    }
  }

  checkEmail = (_rule, value, callback) => {
    let msg;
    try {
      if (value.trim() !== '' && !isEmail(value))
        throw new Error(formatMessage({ id: 'signup.validation.email.required' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  checkPhone = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && !isPhone(value))
        throw new Error(formatMessage({ id: 'validation.phone.required' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  onCheckFinishing = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const { email, firstName, phone } = values;
      if (!err && email && firstName && phone) {
        this.setState({
          finishing: true,
        });
      } else {
        this.setState({
          finishing: false,
        });
      }
    });
  };

  onSubmit = () => {
    const { form, onChangeStep = () => {} } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = [];
        Object.keys(values).map(item => {
          data = [...data, { type: item, value: values[item] }];
          return data;
        });
        onChangeStep(data);
      }
    });
  };

  onBack = () => {
    const { onBack = () => {}, email = '' } = this.props;
    onBack(0, email);
  };

  render() {
    const {
      form: { getFieldDecorator },
      email = '',
      phone = '',
      firstName = '',
    } = this.props;
    const { finishing = false } = this.state;

    return (
      <Row style={{ maxWidth: '500px' }} className={styles.signup_step_2_component}>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <div className={styles.signup_step_2_header}>
                <SignUpSteps current={1} />
                <h1>{formatMessage({ id: 'signup.step_02.title' })}</h1>
                <p>{formatMessage({ id: 'signup.step_02.description' })}</p>
              </div>
            </Col>
            <Col span={24}>
              <Form onChange={this.onCheckFinishing} onSubmit={this.onSubmit}>
                <Row>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_2.wordEmail.title' })}
                      className={styles.signup_form_1}
                    >
                      {getFieldDecorator('email', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkEmail,
                          },
                        ],
                        initialValue: email,
                      })(
                        <SignUpInput
                          size="large"
                          disabled
                          suffix={
                            <span className={styles.link} onClick={this.onBack}>
                              {formatMessage({ id: 'signin.edit' })}
                            </span>
                          }
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_2.firstName.title' })}
                      className={styles.signup_form_2}
                    >
                      {getFieldDecorator('firstName', {
                        rules: [
                          {
                            required: true,
                          },
                        ],
                        initialValue: firstName,
                      })(<SignUpInput size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_2.phone.title' })}
                      className={styles.signup_form_3}
                    >
                      {getFieldDecorator('phone', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkPhone,
                          },
                        ],
                        initialValue: phone,
                      })(<SignUpInput size="large" />)}
                    </FormItem>
                  </Col>
                </Row>
                <FormItem>
                  <SignUpBtn
                    size="large"
                    type="primary"
                    htmlType="submit"
                    disabled={!finishing}
                    onClick={this.onSubmit}
                    title={formatMessage({ id: 'signup.button.continue' })}
                  />
                </FormItem>
                <FormItem>
                  <SignUpBtn
                    size="large"
                    type="primary"
                    btnBack
                    onClick={this.onBack}
                    title={formatMessage({ id: 'signup.button.back' })}
                  />
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Step02;
