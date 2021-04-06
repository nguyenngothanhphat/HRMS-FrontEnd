import { Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import s from './index.less';

export default class PaymentMethods extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: null,
    };
  }

  onClick = () => {
    const { isClicked } = this.state;
    this.setState({
      isClicked: !isClicked,
    });
  };

  render() {
    const { isClicked } = this.state;
    const dateFormat = 'MM.YYYY';
    return (
      <div className={s.root}>
        <div className={s.container}>
          {/* <Form> */}
          <div className={s.container__topView}>
            <p className={s.title}>Payment Methods</p>
          </div>
          <div className={s.container__bottomView}>
            <div className={s.billing}>
              <div className={s.billing__header}>
                <Row>
                  <Col span={8}>
                    <p className={s.billing__header__title}>Billing Methods</p>
                  </Col>
                  <Col span={16}>
                    <p>Bank account</p>
                  </Col>
                </Row>
              </div>
              <div className={s.billing__body}>
                <Form.Item name="cardType">
                  <Row>
                    <Col span={8}>
                      <span>Card Type</span>
                    </Col>
                    <Col span={16}>
                      <Input value="American Express" />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item name="cardNumber">
                  <Row>
                    <Col span={8}>
                      <span>Card Number</span>
                    </Col>
                    <Col span={16}>
                      <Input value={`1234656799423`.replace(/\B(?=(\d{5})+(?!\d))/g, ' ')} />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item name="expirationDate">
                  <Row>
                    <Col span={8}>
                      <span>Expiration date</span>
                    </Col>
                    <Col span={16}>
                      <DatePicker
                        defaultValue={moment('02.02.2021', dateFormat)}
                        className={s.datePicker}
                        format={dateFormat}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </div>
            </div>
            <div className={s.bankAccount}>
              <div className={s.bankAccount__header}>
                <Row>
                  <Col span={8}>
                    <p className={s.bankAccount__header__title}>Bank Account</p>
                  </Col>
                  <Col span={16}>
                    <p className={s.bankAccount__header__subTitle}>Billing Methods</p>
                  </Col>
                </Row>
              </div>
              <div className={s.bankAccount__body}>
                <Form.Item name="bankName">
                  <Row>
                    <Col span={8}>
                      <span>Bank Name</span>
                    </Col>
                    <Col span={16} className={s.column}>
                      <Input className={s.input} value="Well Fargo" disabled={!isClicked} />
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
                <Form.Item name="accountType">
                  <Row>
                    <Col span={8}>
                      <span>Account Type</span>
                    </Col>
                    <Col span={16}>
                      <Input value="Business Checking" />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item name="routingNumber">
                  <Row>
                    <Col span={8}>
                      <span>Routing Number</span>
                    </Col>
                    <Col span={16}>
                      <Input value="79879796" />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item name="accountNumber">
                  <Row>
                    <Col span={8}>
                      <span>Account Number</span>
                    </Col>
                    <Col span={16}>
                      <Input value={`1234566775`.replace(/.(?=.{2})/g, '*')} />
                    </Col>
                  </Row>
                </Form.Item>
              </div>
            </div>
          </div>
          {/* </Form> */}
        </div>
      </div>
    );
  }
}
