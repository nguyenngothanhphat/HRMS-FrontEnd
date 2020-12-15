import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import { ReactComponent as HomeIcon } from '@/assets/dashboard_home.svg';
import Greeting from './components/Greeting';
import ActivityLog from './components/ActivityLog';
import MyApps from './components/MyApps';

import Carousel from './components/Carousel';
import styles from './index.less';

export default class Dashboard extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.containerDashboard}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Dashboard</p>
            </div>
          </Affix>
          <Row gutter={[24, 24]}>
            <Col span={7}>
              {/* <div style={{ width: '100%', backgroundColor: 'red' }}>AAAA</div> */}
              <button type="button" className={styles.homeIcon}>
                <div>
                  <HomeIcon />
                  <span>Home</span>
                </div>
              </button>

              <Greeting />

              <div className={styles.leftContainer}>
                <MyApps />
                <div className={styles.divide} />
                <ActivityLog />
              </div>
            </Col>
            <Col span={17}>
              <Carousel />
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <div style={{ width: '100%', backgroundColor: 'red' }}>AAAAA</div>
                </Col>
                <Col span={12}>
                  <div style={{ width: '100%', backgroundColor: 'red' }}>AAAAA</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}
