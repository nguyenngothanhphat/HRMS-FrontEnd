import React, { Component } from 'react';
import { Row, Col } from 'antd';
import FormLogin from './components/FormLogin';
import styles from './index.less';

export default class Login extends Component {
  render() {
    return (
      <Row className={styles.rootLogin}>
        <Col md={7} lg={9} xl={10} className={styles.contentLeft}>
          <p className={styles.contentLeft__text1}>
            Spending too much time on HR, not your business? We can fix that.
          </p>
          <p className={styles.contentLeft__text2}>
            Streamline onboarding, benefits, payroll, PTO, and more with our simple, intuitive
            platform.
          </p>
        </Col>
        <Col xs={24} sm={24} md={17} lg={15} xl={14} className={styles.contentRight}>
          <FormLogin />
        </Col>
      </Row>
    );
  }
}
