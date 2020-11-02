import React, { PureComponent } from 'react';
import { Row, Col, Tabs } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { history } from 'umi';
import LeaveInformation from './components/LeaveInformation';
import ApplyRequest from './components/ApplyRequest';
import LeaveHistoryAndHoliday from './components/LeaveHistoryAndHoliday';
import QuickLinks from './components/QuickLinks';
import TimeOffRequests from './components/TimeOffRequests';
import SetupTimeoff from './components/SetupTimeoff';
import styles from './index.less';

const { TabPane } = Tabs;
export default class TimeOff extends PureComponent {
  buttonOnClickComp = () => {
    // eslint-disable-next-line no-alert
    history.push(`/time-off/compoff-request`);
  };

  buttonOnClickLeave = () => {
    // eslint-disable-next-line no-alert
    history.push(`/time-off/leave-request`);
  };

  _renderLandingPage = () => {
    const describeText = [
      <p>
        Apply for leaves with/without pay, work from home or client office.
        <br />
        All request must be approved by your manager and supervisor to avail it.
        <br />
        <br />
        Special leaves can be availed on acase-to-case basis.
      </p>,
      <p>
        Request for a compensation leave if you have worked for extra days/hours. Once approved by
        your manager and supervisor, it will be credited to your total leave balance.
      </p>,
    ];
    return (
      <div className={styles.TimeOff}>
        <Row gutter={[20, 20]}>
          <Col xs={6}>
            <Row gutter={[20, 20]}>
              <Col span={24}>
                <LeaveInformation />
              </Col>
              <Col span={24}>
                <LeaveHistoryAndHoliday />
              </Col>
              <Col span={24}>
                <QuickLinks />
              </Col>
            </Row>
          </Col>
          <Col xs={18}>
            <Row gutter={[20, 20]}>
              <Col span={15}>
                <ApplyRequest
                  title="Apply for Timeoff from Office"
                  describe={describeText[0]}
                  buttonText="Request Time Off"
                  onClick={this.buttonOnClickLeave}
                  type={1}
                />
              </Col>
              <Col span={9}>
                <ApplyRequest
                  title="Apply for Compoff"
                  describe={describeText[1]}
                  onClick={this.buttonOnClickComp}
                  buttonText="Request Compoff"
                  type={2}
                />
              </Col>
            </Row>
            <Row gutter={[20, 20]}>
              <Col span={24}>
                <TimeOffRequests />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  _renderSetupTimeoff = () => {
    return <SetupTimeoff />;
  };

  render() {
    return (
      <PageContainer>
        <Tabs defaultActiveKey="setupTimeOff">
          <TabPane tab="Landing page" key="langdingPage">
            {this._renderLandingPage()}
          </TabPane>
          <TabPane tab="Setup Timeoff policy" key="setupTimeOff">
            {this._renderSetupTimeoff()}
          </TabPane>
        </Tabs>
      </PageContainer>
    );
  }
}
