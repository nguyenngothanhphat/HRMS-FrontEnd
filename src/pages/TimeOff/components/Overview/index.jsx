import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { goToTop } from '@/utils/utils';
import ApplyRequest from './components/ApplyRequest';
import EmployeeRequestTable from './components/EmployeeRequestTable';
import LeaveHistoryAndHoliday from './components/LeaveHistoryAndHoliday';
import LeaveInformation from './components/LeaveInformation';
import ManagerRequestTable from './components/ManagerRequestTable';
import QuickLinks from './components/QuickLinks';
import styles from './index.less';

const Overview = (props) => {
  const {
    eligibleForCompOff = false,
    viewHRTimeoff = false,
    viewManagerTimeoff = false,
    viewRequestOnBehalfOf = false,
    dispatch,
  } = props;

  useEffect(() => {
    goToTop();
    return () => {
      dispatch({
        type: 'timeOff/save',
        payload: {
          currentLeaveTypeTab: '1',
          currentScopeTab: '1',
          totalByType: {},
          totalByStatus: {},
          currentPayloadTypes: [],
        },
      });
    };
  }, []);

  const buttonOnClickCompoff = () => {
    history.push({
      pathname: `/time-off/overview/personal-compoff/new`,
    });
  };

  const buttonOnClickLeave = () => {
    history.push({
      pathname: `/time-off/overview/personal-timeoff/new`,
    });
  };
  const buttonOnClickBehalfOf = () => {
    history.push({
      pathname: `/time-off/overview/personal-timeoff/new-behalf-of`,
    });
  };

  const onInformationClick = () => {
    window.scroll({ top: 150, left: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className={styles.Overview}>
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={6}>
            <Row gutter={[20, 20]}>
              <Col span={24}>
                <LeaveInformation onInformationClick={onInformationClick} />
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
                  onClick={buttonOnClickLeave}
                  onBehalfOf={buttonOnClickBehalfOf}
                  type={1}
                  viewRequestOnBehalfOf={viewRequestOnBehalfOf}
                />
              </Col>
              {eligibleForCompOff && (
                <Col xs={24} lg={9}>
                  <ApplyRequest
                    title="Apply for Compoff"
                    onClick={buttonOnClickCompoff}
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
            {/* {!closeFeedbackBar && (
                <Row gutter={[20, 20]}>
                  <Col span={24}>
                    <FeedbackBar onClose={onCloseFeedbackBar} />
                  </Col>
                </Row>
              )} */}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default connect(({ timeOff, user }) => ({
  timeOff,
  user,
}))(Overview);
