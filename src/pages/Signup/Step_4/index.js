import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Col } from 'antd';
import { isPhone } from '@/utils/utils';
import SignUpInput from '../components/Input';
import SignUpBtn from '../components/Button';
import SignUpSelect from '../components/Select';
import SignUpSteps from '../components/Steps';
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ currency: { list = [] } }) => ({
  list,
}))
@Form.create()
class Step04 extends React.Component {
  state = {
    finishing: false,
  };

  componentDidMount() {
    const { item = {} } = this.props;
    let error = [];
    Object.keys(item).map(nItem => {
      if (item[nItem] && item[nItem].length <= 0) {
        error = [...error, nItem];
      }
      return error;
    });
    if (error.length > 0) {
      this.setState({
        finishing: true,
      });
    }
  }

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

  checkName = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && value.trim().length < 1)
        throw new Error(formatMessage({ id: 'signup.step_4.locationName.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  checkAddress = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && value.length < 3)
        throw new Error(formatMessage({ id: 'signup.step_03.companyAdd.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  checkDistance = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && value.length < 2)
        throw new Error(formatMessage({ id: 'signup.step_4.distance.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  checkCurrency = (_rule, value = '', callback) => {
    let msg;
    try {
      if (value.trim() !== '' && value.length < 1)
        throw new Error(formatMessage({ id: 'signup.step_4.currency.description' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
  };

  onCheckFinishing = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const { name, address, currency, distanceUnit, phone } = values;
      if (
        !err &&
        name.length > 0 &&
        address.length > 0 &&
        currency.length > 0 &&
        distanceUnit.length > 0 &&
        phone.length > 0
      ) {
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
      list = [],
    } = this.props;
    const { finishing = false } = this.state;
    return (
      <Row style={{ maxWidth: '500px' }} className={styles.signup_step_4_component}>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <div className={styles.signup_step_4_header}>
                <SignUpSteps current={3} />
                <h1>{formatMessage({ id: 'signup.step_04.title' })}</h1>
                <p>{formatMessage({ id: 'signup.step_04.description' })}</p>
              </div>
            </Col>
            <Col span={24}>
              <Form onChange={this.onCheckFinishing} onSubmit={this.onSubmit}>
                <Row>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_4.locationName.title' })}
                      className={styles.signup_form_1}
                    >
                      {getFieldDecorator('name', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkName,
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
                            validator: this.checkAddress,
                          },
                        ],
                        initialValue: item.address || '',
                      })(<SignUpInput size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_4.currency.title' })}
                      className={styles.signup_form_2}
                    >
                      {getFieldDecorator('currency', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkCurrency,
                          },
                        ],
                        initialValue: item.currency || '',
                      })(<SignUpSelect data={list} type="currency" />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label={formatMessage({ id: 'signup.step_4.distance.title' })}
                      className={styles.signup_form_2}
                    >
                      {getFieldDecorator('distanceUnit', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkDistance,
                          },
                        ],
                        initialValue: item.distanceUnit || '',
                      })(<SignUpSelect data={['Km', 'Mile']} />)}
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
                        initialValue: item.phone || '',
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
                      onBack(2);
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

export default Step04;
