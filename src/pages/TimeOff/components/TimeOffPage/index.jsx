import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import LeaveInformation from './components/LeaveInformation';
import styles from './index.less';

export default class TimeOffPage extends PureComponent {
  render() {
    return (
      <div className={styles.TimeOffPage}>
        <Row>
          <Col xs={6}>
            <LeaveInformation />
          </Col>
          <Col xs={18}>Hi</Col>
        </Row>
      </div>
    );
  }
}
