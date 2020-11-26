import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import RightContetInfo from './RightContent';
import RequestInformation from './RequestInformation';
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
              <p className={styles.titlePage__text}>Request for Timeoff</p>
            </div>
          </Affix>
          <Row className={styles.leaveRequest__content} gutter={[20, 20]}>
            <Col span={14}>
              <RequestInformation />
            </Col>
            <Col span={10}>
              <RightContetInfo />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default LeaveRequestForm;
