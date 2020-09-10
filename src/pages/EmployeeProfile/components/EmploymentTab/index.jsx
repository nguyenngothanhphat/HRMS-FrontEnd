import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class EmploymentTab extends PureComponent {
  render() {
    return (
      <div className={styles.employmentTab}>
        <Row justify="left">
          <Col span={6}>col-4</Col>
          <Col span={6}>col-4</Col>
          <Col span={6}>col-4</Col>
          <Col span={3}>col-4</Col>
        </Row>
      </div>
    );
  }
}

export default EmploymentTab;
