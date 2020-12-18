import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import { connect } from 'umi';
import Greeting from './components/Greeting';
import ActivityLog from './components/ActivityLog';
import MyApps from './components/MyApps';
import TabManageTeamWork from './components/TabManageTeamWork';
import TimeSheet from './components/TimeSheet';
import Links from './components/Links';
import Carousel from './components/Carousel';

import styles from './index.less';

const listLinkFQAs = [
  { name: 'I cannot access an app?', href: '' },
  { name: 'How do I integrate google calendar with the portal?', href: '' },
  { name: 'I cannot access an app?', href: '' },
  { name: 'How do I integrate google calendar with the portal?', href: '' },
  { name: 'How do I remove an app from the list of apps?', href: '' },
  { name: 'How do I remove an app from the list of apps?', href: '' },
];

const listQuickLinks = [
  { name: 'Coronavirus resources', href: '', isNew: true },
  { name: 'Work From Home guidelines', href: '', isNew: true },
  { name: 'Employee Handbook', href: '' },
  { name: 'Annual Report 2020', href: '' },
  { name: 'Training Program 2020', href: '' },
  { name: 'Submit Commuter Claim', href: '' },
];

@connect(({ user }) => user)
// @connect(({ candidateInfo = {}, user, loading }) => ({
//   candidateInfo,
//   user,
//   loading1: loading.effects['candidateInfo/fetchCandidateByRookie'],
// }))
class Dashboard extends PureComponent {
  render() {
    console.log(this.props);
    const { currentUser = {} } = this.props;
    const { name = '' } = currentUser;
    console.log(name);
    return (
      <PageContainer>
        <div className={styles.containerDashboard}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Dashboard</p>
            </div>
          </Affix>
          <Row gutter={[24, 24]} style={{ padding: '20px 20px 0 0' }}>
            <Col span={7}>
              <Greeting name={name} />
              <div className={styles.leftContainer}>
                <ActivityLog />
              </div>
            </Col>
            <Col span={17}>
              <Carousel />
              <MyApps />
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <TabManageTeamWork />
                </Col>
                <Col span={12}>
                  <TimeSheet />
                </Col>
                <Col span={12}>
                  <Links title="FAQs" showButton listData={listLinkFQAs} />
                </Col>
                <Col span={12}>
                  <Links title="Quick Links" listData={listQuickLinks} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default Dashboard;
