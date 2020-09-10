import React, { Component } from 'react';
import styles from './index.less';
import { Typography, Row, Col } from 'antd';
class StepsComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { Steps } = this.props;
    return (
      <div className={styles.StepsComponent}>
        <Typography.Title level={5}>{Steps.title}</Typography.Title>
        <Row className={styles.Padding}>
          <Col span={6}>
            <div className={styles.Circle}>{Steps.keyPage[0].key}</div>
          </Col>
          <Col span={16}>
            <Typography.Text>{Steps.keyPage[0].data}</Typography.Text>
          </Col>
        </Row>
        <Row>
          <div className={styles.smallCircle}></div>
        </Row>
      </div>
    );
  }
}

export default StepsComponent;
