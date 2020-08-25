import React from 'react';
// import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Col } from 'antd';
import Link from 'umi/link';
import { isEmail } from '@/utils/utils';

import SignUpInput from '../components/Input';
import SignUpBtn from '../components/Button';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
class Step01 extends React.Component {
  state = {
    finishing: false,
  };

  componentDidMount() {
    const { email = '' } = this.props;
    if (email && isEmail(email)) {
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

  onSubmit = () => {
    const { onChangeStep = () => {}, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err && values.email) {
        // onChangeStep(1, values.email);
        onChangeStep(5, values.email);
      }
    });
  };

  render() {
    const {
      form,
      form: { getFieldDecorator },
      email = '',
    } = this.props;
    const { finishing = false } = this.state;

    return (
      <Row style={{ maxWidth: '500px' }} className={styles.signup_step_1_component}>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <div className={styles.signup_step_1_header}>
                <h1>{formatMessage({ id: 'signup.step_01.title' })}</h1>
                <p>{formatMessage({ id: 'signup.step_01.description' })}</p>
              </div>
            </Col>
            <Col span={24}>
              <Form
                onChange={() => {
                  form.validateFieldsAndScroll((err, values) => {
                    if (!err && values.email) {
                      this.setState({
                        finishing: true,
                      });
                    } else {
                      this.setState({
                        finishing: false,
                      });
                    }
                  });
                }}
                onSubmit={this.onSubmit}
              >
                <Row>
                  <Col span={24}>
                    <FormItem label={formatMessage({ id: 'signup.wordEmail.title' })}>
                      {getFieldDecorator('email', {
                        rules: [
                          {
                            required: true,
                            validator: this.checkEmail,
                          },
                        ],
                        initialValue: email || '',
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
                <div className={styles.signup_step_1_back_to_signin}>
                  {formatMessage({ id: 'signup.step_01.back.to.signin' })}{' '}
                  <Link to="/login" className={styles.signup_step_1_back_to_signin_link}>
                    {formatMessage({ id: 'signup.step_01.link.back.to.signin' })}
                  </Link>
                </div>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Step01;
