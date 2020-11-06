import React, { PureComponent } from 'react';
import { Row, Col, Tabs, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { history } from 'umi';
import LeaveInformation from './components/LeaveInformation';
import ApplyRequest from './components/ApplyRequest';
import LeaveHistoryAndHoliday from './components/LeaveHistoryAndHoliday';
import QuickLinks from './components/QuickLinks';
import TimeOffRequests from './components/TimeOffRequests';
import SetupTimeoff from './components/SetupTimeoff';
import LeaveBalanceInfo from './components/LeaveBalanceInfo';

import styles from './index.less';

const { TabPane } = Tabs;
export default class TimeOff extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewInformation: false,
    };
  }

  buttonOnClick = () => {
    // eslint-disable-next-line no-alert
    history.push(`/time-off/compoff-request`);
  };

  buttonOnClickLeave = () => {
    // eslint-disable-next-line no-alert
    history.push(`/time-off/leave-request`);
  };

  onInformationCLick = () => {
    const { viewInformation } = this.state;
    this.setState({
      viewInformation: !viewInformation,
    });
  };

  onInformationCLick = () => {
    const { viewInformation } = this.state;
    this.setState({
      viewInformation: !viewInformation,
    });
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
    const { viewInformation } = this.state;
    return (
      <>
        <Affix offsetTop={40}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>Time Off</p>
          </div>
        </Affix>
        <div className={styles.TimeOff}>
          <Row gutter={[20, 20]}>
            <Col xs={24} md={6}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <LeaveInformation onInformationCLick={this.onInformationCLick} />
                </Col>
                <Col span={24}>
                  <LeaveHistoryAndHoliday />
                </Col>
                <Col span={24}>
                  <QuickLinks />
                </Col>
              </Row>
            </Col>
            {!viewInformation && (
              <Col xs={24} md={18}>
                <Row gutter={[20, 20]}>
                  <Col xs={24} lg={15}>
                    <ApplyRequest
                      title="Apply for Timeoff from Office"
                      describe={describeText[0]}
                      buttonText="Request Time Off"
                      onClick={this.buttonOnClickLeave}
                      type={1}
                    />
                  </Col>
                  <Col xs={24} lg={9}>
                    <ApplyRequest
                      title="Apply for Compoff"
                      describe={describeText[1]}
                      onClick={this.buttonOnClick}
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
            )}

            {viewInformation && (
              <Col xs={24} md={18}>
                <LeaveBalanceInfo onClose={this.onInformationCLick} />
              </Col>
            )}
          </Row>
        </div>
      </>
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
