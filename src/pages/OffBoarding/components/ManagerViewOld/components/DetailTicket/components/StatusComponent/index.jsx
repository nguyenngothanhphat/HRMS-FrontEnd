import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import StatusRequest from '@/components/StatusRequest';
import OffBoardingRequest from '@/assets/lightIcon.svg';

import styles from './index.less';

class StatusComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { status = '' } = this.props;
    return (
      <div className={styles.header}>
        <Row>
          <Col span={12}>
            <div className={styles.right}>
              <img src={OffBoardingRequest} alt="offboarding-request" />
              <div className={styles.titleHeader}>
                This request is still under review by the reporting manager
              </div>
            </div>
          </Col>
          <Col span={12} className={styles.left}>
            <StatusRequest status={status} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default StatusComponent;
