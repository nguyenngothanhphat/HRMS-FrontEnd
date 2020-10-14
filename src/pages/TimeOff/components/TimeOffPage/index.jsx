import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import LeaveInformation from './components/LeaveInformation';
import ApplyRequest from './components/ApplyRequest';
import LeaveHistoryAndHoliday from './components/LeaveHistoryAndHoliday';
import QuickLinks from './components/QuickLinks';
import TimeOffRequests from './components/TimeOffRequests';

import styles from './index.less';

export default class TimeOffPage extends PureComponent {
  buttonOnClick = () => {
    alert('Clicked Button');
  };

  render() {
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
      <div className={styles.TimeOffPage}>
        <Row gutter={[16, 16]}>
          <Col xs={6}>
            <Row gutter={[16, 16]}>
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
            <Row gutter={[16, 16]}>
              <Col span={15}>
                <ApplyRequest
                  title="Apply for Timeoff from Office"
                  describe={describeText[0]}
                  buttonText="Request Time Off"
                  onClick={this.buttonOnClick}
                  type={1}
                />
              </Col>
              <Col span={9}>
                <ApplyRequest
                  title="Apply for Compoff"
                  describe={describeText[1]}
                  onClick={this.buttonOnClick}
                  buttonText="Request Compoff"
                  type={2}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <TimeOffRequests />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
