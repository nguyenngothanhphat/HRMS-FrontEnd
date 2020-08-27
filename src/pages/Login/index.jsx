import React, { Component } from 'react';
import { Row, Col } from 'antd';
import FormLogin from './components/FormLogin';
import styles from './index.less';

export default class Login extends Component {
  render() {
    return (
      <Row className={styles.rootLogin}>
        <Col md={9} lg={9} xl={10} className={styles.contentLeft}>
          Content Left
        </Col>
        <Col xs={24} sm={24} md={15} lg={15} xl={14} className={styles.contentRight}>
          <FormLogin />
        </Col>
      </Row>
    );
  }
}
