import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import YourTimeline from './components/YourTimeline';
import NextStep from './components/NextStep';
import BidAdieu from './components/BidAdieu';
import Sidebar from './components/Sidebar';
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
            <Sidebar />
          </Col>
        </Row>
      </div>
    );
  }
}

export default RelievingFormalities;
