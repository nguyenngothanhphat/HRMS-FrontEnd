import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
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
          <Row gutter={[24, 24]} style={{ padding: '20px' }}>
            <Col span={6}>
              <div style={{ width: '100%', backgroundColor: 'red' }}>AAAA</div>
            </Col>
            <Col span={18}>
              <Carousel />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}
