import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Col } from 'antd';
import { isEmail, isPhone, isWeb } from '@/utils/utils';
import SignUpInput from '../components/Input';
import SignUpBtn from '../components/Button';
import SignUpSteps from '../components/Steps';
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ signup }) => ({
  signup,
}))
@Form.create()
class Step03 extends React.Component {
  state = {
    finishing: false,
  };

  componentDidMount() {
    const { item = {} } = this.props;
    if (Object.keys(item).length > 0) {
      let error = [];
      Object.keys(item).map(nItem => {
        if (item[nItem] && item[nItem].length <= 0) {
          error = [...error, nItem];
        }
        return error;
      });
      if (error.length <= 0) {
        this.setState({
          finishing: true,
        });
      }
    }
  }

  checkEmail = (_rule, value, callback) => {
    let msg;
    try {
      if (value.trim() !== '' && !isEmail(value))
        throw new Error(formatMessage({ id: 'signup.step_03.email.description' }));
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

  checkWebsite = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && !isWeb(value))
        throw new Error(formatMessage({ id: 'signup.step_03.website.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  checkCompanyName = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() === '')
        throw new Error(formatMessage({ id: 'signup.step_03.companyName.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  checkCompanyAddress = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && value.trim().length < 3)
        throw new Error(formatMessage({ id: 'signup.step_03.companyAdd.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  onCheckFinishing = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const { name, address, companyEmail, website, phone } = values;
      if (!err && name && address && companyEmail && website && phone) {
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

  render() {
    const {
      form: { getFieldDecorator },
      onBack = () => {},
      item = {},
    } = this.props;
    const { finishing = false } = this.state;
    return (
      <Row style={{ maxWidth: '500px' }} className={styles.signup_step_3_component}>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <div className={styles.signup_step_3_header}>
                <SignUpSteps current={2} />
                <h1>{formatMessage({ id: 'signup.step_03.title' })}</h1>
                <p>{formatMessage({ id: 'signup.step_03.description' })}</p>
              </div>
            </Col>
            <Col span={24}>
              <Form onChange={this.onCheckFinishing} onSubmit={this.onSubmit}>
                <Row>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_3.companyName.title' })}
                      className={styles.signup_form_1}
                    >
                      {getFieldDecorator('name', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkCompanyName,
                          },
                        ],
                        initialValue: item.name || '',
                      })(<SignUpInput size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_3.companyAdd.title' })}
                      className={styles.signup_form_2}
                    >
                      {getFieldDecorator('address', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkCompanyAddress,
                          },
                        ],
                        initialValue: item.address || '',
                      })(<SignUpInput size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_2.phone.title' })}
                      className={styles.signup_form_2}
                    >
                      {getFieldDecorator('phone', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkPhone,
                          },
                        ],
                        initialValue: item.phone || '',
                      })(<SignUpInput size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_3.email.title' })}
                      className={styles.signup_form_2}
                    >
                      {getFieldDecorator('companyEmail', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkEmail,
                          },
                        ],
                        initialValue: item.companyEmail || '',
                      })(<SignUpInput size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_3.website.title' })}
                      className={styles.signup_form_3}
                    >
                      {getFieldDecorator('website', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkWebsite,
                          },
                        ],
                        initialValue: item.website || '',
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
                    onClick={() => {
                      onBack(1);
                    }}
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

export default Step03;
