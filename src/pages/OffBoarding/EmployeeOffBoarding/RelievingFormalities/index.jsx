import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import YourTimeline from './components/YourTimeline';
import NextStep from './components/NextStep';
import BidAdieu from './components/BidAdieu';
import styles from './index.less';

class RelievingFormalities extends PureComponent {
  render() {
    return (
      <div className={styles.RelievingFormalities}>
        <Row gutter={['20', '0']}>
          <Col span={18}>
            <Row>
              <YourTimeline />
            </Row>
            <Row>
              <NextStep />
            </Row>
            <Row>
              <BidAdieu />
            </Row>
          </Col>
          <Col span={6}>
            <h1>Something else</h1>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RelievingFormalities;
