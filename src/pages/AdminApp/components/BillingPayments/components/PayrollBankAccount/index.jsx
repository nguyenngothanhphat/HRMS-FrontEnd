import React, { PureComponent } from 'react';
import { Input, Form, Row, Col } from 'antd';
import s from './index.less';

export default class PayrollBankAccount extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: null,
    };
  }

  onClick = () => {
    const { isClicked } = this.state;
    this.setState({ isClicked: !isClicked });
  };

  render() {
    const { isClicked } = this.state;
    return (
      <div className={s.root}>
        <div className={s.blockContent}>
          <div className={s.blockContent__header}>
            <p className={s.title}>Payroll Bank Account</p>
          </div>
          <div className={s.blockContent__bottom}>
            {/* <Form> */}
            <Form.Item name="routingNumber">
              <Row className={s.blockContent__bottom__row}>
                <Col span={8}>
                  <p className={s.blockContent__bottom__row__textLabel}>Routing Number</p>
                </Col>
                <Col className={s.column} span={16}>
                  <Input
                    className={s.input}
                    // formatter={(value) => `${value}`.replace(/.(?=.{4})/g, '*')}
                    disabled={!isClicked}
                    value={'12345678'.replace(/.(?=.{4})/g, '*')}
                  />
                  <span
                    className={isClicked ? `${s.hide} ${s.action}` : `${s.action}`}
                    onClick={this.onClick}
                  >
                    Change
                  </span>
                  <div
                    className={
                      isClicked ? `${s.afterAction} ${s.unhide}` : `${s.afterAction} ${s.hide}`
                    }
                  >
                    <span className={s.save} onClick={this.onClick}>
                      Save
                    </span>
                    <span onClick={this.onClick} className={s.cancel}>
                      Cancel
                    </span>
                  </div>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item name="accountNumber">
              <Row className={s.blockContent__bottom__row}>
                <Col span={8}>
                  <p className={s.blockContent__bottom__row__textLabel}>Account Number</p>
                </Col>
                <Col span={16}>
                  <Input placeholder="Please fill your account number" />
                </Col>
              </Row>
            </Form.Item>
            {/* </Form> */}
          </div>
        </div>
      </div>
    );
  }
}
