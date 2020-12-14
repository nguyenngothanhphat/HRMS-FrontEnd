import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { history } from 'umi';
import LeaveInformation from '../EmployeeRole/components/LeaveInformation';
import ApplyRequest from '../EmployeeRole/components/ApplyRequest';
import LeaveHistoryAndHoliday from '../EmployeeRole/components/LeaveHistoryAndHoliday';
import QuickLinks from '../EmployeeRole/components/QuickLinks';
import TimeOffRequestsTable from './components/TimeOffRequestsTable';
import FeedbackBar from '../EmployeeRole/components/FeedbackBar';
import LeaveBalanceInfo from '../EmployeeRole/components/LeaveBalanceInfo';

import styles from './index.less';

export default class ManagerRole extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewInformation: false,
      closeFeedbackBar: false,
    };
  }

  componentDidMount = () => {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  };

  onCloseFeedbackBar = () => {
    this.setState({
      closeFeedbackBar: true,
    });
  };

  buttonOnClick = () => {
    // eslint-disable-next-line no-alert
    history.push(`/time-off/new-compoff-request`);
  };

  buttonOnClickLeave = () => {
    history.push({
      pathname: `/time-off/new-leave-request`,
      state: { action: 'NEW-REQUEST' },
    });
  };

  onInformationCLick = () => {
    const { viewInformation } = this.state;
    this.setState({
      viewInformation: !viewInformation,
    });
  };

  render() {
    const describeText = [
      <p>Apply for leaves with/without pay, work from home or client office.</p>,
      <p>Request for a compensation leave if you have worked for extra days/hours.</p>,
    ];
    const { viewInformation, closeFeedbackBar } = this.state;
    return (
      <>
        <div className={styles.ManagerRole}>
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
                  <TimeOffRequestsTable />
                </Col>
              </Row>
              {!closeFeedbackBar && (
                <Row gutter={[20, 20]}>
                  <Col span={24}>
                    <FeedbackBar onClose={this.onCloseFeedbackBar} />
                  </Col>
                </Row>
              )}
              <LeaveBalanceInfo onClose={this.onInformationCLick} visible={viewInformation} />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
