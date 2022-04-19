import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { history } from 'umi';
import LeaveInformation from './components/LeaveInformation';
import ApplyRequest from './components/ApplyRequest';
import LeaveHistoryAndHoliday from './components/LeaveHistoryAndHoliday';
import QuickLinks from './components/QuickLinks';
import EmployeeRequestTable from './components/EmployeeRequestTable';
import ManagerRequestTable from './components/ManagerRequestTable';
import TimeOffTypesInfo from './components/TimeOffTypesInfo';

import styles from './index.less';
import FeedbackBar from './components/FeedbackBar';

export default class EmployeeLandingPage extends PureComponent {
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

  buttonOnClickCompoff = () => {
    history.push({
      pathname: `/time-off/overview/personal-compoff/new`,
    });
  };

  buttonOnClickLeave = () => {
    history.push({
      pathname: `/time-off/overview/personal-timeoff/new`,
    });
  };

  onInformationClick = () => {
    window.scroll({ top: 150, left: 0, behavior: 'smooth' });
    const { viewInformation } = this.state;
    this.setState({
      viewInformation: !viewInformation,
    });
  };

  render() {
    const { viewInformation, closeFeedbackBar } = this.state;
    const {
      eligibleForCompOff = false,
      viewHRTimeoff = false,
      viewManagerTimeoff = false,
    } = this.props;

    return (
      <>
        <div className={styles.EmployeeLandingPage}>
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={6}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <LeaveInformation
                    viewDocumentVisible={viewInformation}
                    onInformationClick={this.onInformationClick}
                  />
                </Col>
                <Col span={24}>
                  <LeaveHistoryAndHoliday />
                </Col>
                <Col span={24}>
                  <QuickLinks />
                </Col>
              </Row>
            </Col>

            <Col xs={24} lg={18}>
              <Row gutter={[20, 20]} style={{ marginBottom: '20px' }}>
                <Col xs={24} lg={eligibleForCompOff ? 15 : 24}>
                  <ApplyRequest
                    title="Apply for Timeoff from Office"
                    buttonText="Request Time Off"
                    onClick={this.buttonOnClickLeave}
                    type={1}
                  />
                </Col>
                {eligibleForCompOff && (
                  <Col xs={24} lg={9}>
                    <ApplyRequest
                      title="Apply for Compoff"
                      onClick={this.buttonOnClickCompoff}
                      buttonText="Request Compoff"
                      type={2}
                    />
                  </Col>
                )}
              </Row>
              <Row gutter={[20, 20]} style={{ marginBottom: '20px' }}>
                <Col span={24}>
                  {viewHRTimeoff || viewManagerTimeoff ? (
                    <ManagerRequestTable eligibleForCompOff={eligibleForCompOff} />
                  ) : (
                    <EmployeeRequestTable eligibleForCompOff={eligibleForCompOff} />
                  )}
                </Col>
              </Row>
              {!closeFeedbackBar && (
                <Row gutter={[20, 20]}>
                  <Col span={24}>
                    <FeedbackBar onClose={this.onCloseFeedbackBar} />
                  </Col>
                </Row>
              )}
              <TimeOffTypesInfo onClose={this.onInformationClick} visible={viewInformation} />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
