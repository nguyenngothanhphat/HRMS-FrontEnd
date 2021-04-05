import { Col, Form, Input, Row } from 'antd';
import React, { PureComponent } from 'react';
import s from './index.less';

export default class PaymentMethods extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Form>
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
                  <Form.Item>
                    <Row>
                      <Col span={8}>
                        <span>Card Type</span>
                      </Col>
                      <Col span={16}>
                        <Input />
                      </Col>
                    </Row>
                  </Form.Item>
                </div>
              </div>
              <div className={s.bankAccount}>
                <div className={s.bankAccount__header}>
                  <p className={s.bankAccount__header__title}>Bank Account</p>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
