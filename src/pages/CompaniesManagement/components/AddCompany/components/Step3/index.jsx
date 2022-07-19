/* eslint-disable no-template-curly-in-string */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-unused-vars */
import React, { Fragment, Component } from 'react';
import { Form, Input, Select, Row, Col, Checkbox, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

const { Option } = Select;

@connect(({ country: { listState = [], listCountry = [] } = {}, signup = {} }) => ({
  listState,
  listCountry,
  signup,
}))
class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate phone number!',
      },
    };
    return (
      <div className={styles.root}>
        <Row justify="center">
          <Row gutter={[30, 0]}>
            <Col>
              <div className={styles.root__form}>
                <Form
                  name="formOwnerContact"
                  requiredMark={false}
                  layout="vertical"
                  colon={false}
                  initialValues={
                    {
                      // name,
                      // dba,
                      // ein,
                    }
                  }
                  validateMessages={validateMessages}
                  onValuesChange={this.handleFormCompanyChange}
                >
                  <Fragment>
                    <p className={styles.root__form__title}>Enter owner's contact</p>
                    <p className={styles.root__form__description}>
                      We need to collect some basic information so that we can contact you easily.
                    </p>

                    <Form.Item label="Full Name" name="name">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Phone Number"
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'page.signUp.step3.phoneError' }),
                        },
                        {
                          // pattern: /^(?:\d*)$/,
                          pattern:
                            // eslint-disable-next-line no-useless-escape
                            /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?$/gm,
                          message: formatMessage({ id: 'page.signUp.step3.phoneError2' }),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Fragment>
                </Form>
              </div>
              <div className={styles.root__viewBtn}>
                <Button className={styles.btnSave} type="primary" onClick={this.handleNext}>
                  Submit
                </Button>
              </div>
            </Col>
            <Col>
              <div className={styles.root__form__image}>
                <img src="/assets/images/Intranet_01@3x.png" alt="image_intranet" />
              </div>
            </Col>
          </Row>
        </Row>
      </div>
    );
  }
}

export default Step3;
