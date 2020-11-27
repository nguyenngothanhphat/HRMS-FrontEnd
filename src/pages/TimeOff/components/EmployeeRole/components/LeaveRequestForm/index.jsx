import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import RightContetInfo from './RightContent';
import LeftInfo from './RequestInfonation';
import styles from './index.less';

class LeaveRequestForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageContainer>
        <div className={styles.leaveRequest}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Request for Compoff</p>
            </div>
          </Affix>
          <Row className={styles.leaveRequest__content} gutter={[24, 0]}>
            <Col span={17}>
              <LeftInfo />
            </Col>
            <Col span={7}>
              <RightContetInfo />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default LeaveRequestForm;
