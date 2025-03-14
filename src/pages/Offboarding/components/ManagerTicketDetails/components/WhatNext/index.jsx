import { Card, Col, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { DATE_FORMAT, OFFBOARDING } from '@/constants/offboarding';
import SetMeetingModal from '@/pages/Offboarding/components/SetMeetingModal';
import { getEmployeeName, onJoinMeeting } from '@/utils/offboarding';
import styles from './index.less';

const WhatNext = (props) => {
  const {
    dispatch,
    item: { _id = '', employee = {}, status = '', meeting = {} } = {},
    setIsEnterClosingComment = () => {},
    disabled = false,
  } = props;

  const {
    status: meetingStatus = '',
    managerDate = '',
    employeeDate = '',
    isAccept = false,
    id: meetingId = '',
  } = meeting;

  const [oneOnOneMeetingModalVisible, setOneOnOneMeetingModalVisible] = useState(false);

  // functionalities
  const onSetOneOnOneMeeting = async (values) => {
    const res = await dispatch({
      type: 'offboarding/updateRequestEffect',
      payload: {
        id: _id,
        employeeId: employee?._id,
        action: OFFBOARDING.UPDATE_ACTION.MANAGER_RESCHEDULE,
        meeting: {
          managerDate: moment(values.time).format('YYYY/MM/DD hh:mm:ss'),
        },
      },
    });
    if (res.statusCode === 200) {
      setOneOnOneMeetingModalVisible(false);
    }
  };

  const onAcceptMeeting = async () => {
    dispatch({
      type: 'offboarding/updateRequestEffect',
      payload: {
        id: _id,
        employeeId: employee?._id,
        action: OFFBOARDING.UPDATE_ACTION.MANAGER_ACCEPT_MEETING,
      },
    });
  };

  // render UI
  const renderTitle = () => {
    switch (status) {
      case 4:
        return '1 -on- 1 Meeting Completed';
      default:
        return 'What next?';
    }
  };

  const renderContent = () => {
    switch (meetingStatus) {
      case OFFBOARDING.MEETING_STATUS.NOT_START:
        return (
          <Row gutter={[24, 16]} className={styles.content} align="middle">
            <Col span={16} className={styles.text1}>
              <span>
                Schedule a 1-on-1 call with {getEmployeeName(employee.generalInfoInfo)} and provide
                your closing comments for the same
              </span>
            </Col>
            <Col span={8}>
              <div className={styles.oneInOneButton}>
                <CustomPrimaryButton
                  disabled={disabled}
                  onClick={() => setOneOnOneMeetingModalVisible(true)}
                >
                  Schedule a 1-on-1
                </CustomPrimaryButton>
              </div>
            </Col>
            <Col span={16}>
              <span className={styles.text2}>
                <span style={{ fontWeight: 500 }}>Note: </span>
                The one on one needs to be completed within 10 days from the date the request was
                created.
              </span>
            </Col>
            <Col span={8} />
          </Row>
        );

      case OFFBOARDING.MEETING_STATUS.MANAGER_PICK_DATE:
        return (
          <Row gutter={[24, 16]} className={styles.content} align="top">
            <Col span={10} lg={8}>
              <div className={styles.leftPart}>
                <span className={styles.label}>1-on-1 meeting with</span>
                <CustomEmployeeTag
                  title={employee?.titleInfo?.name}
                  name={getEmployeeName(employee?.generalInfoInfo)}
                  avatar={employee?.generalInfoInfo?.avatar}
                  userId={employee?.generalInfoInfo?.userId}
                />
              </div>
            </Col>
            <Col span={14} lg={16}>
              <div className={styles.rightPart}>
                <span className={styles.label}>Scheduled on</span>
                <span className={styles.time}>
                  {moment(managerDate).format(`${DATE_FORMAT} | h:mm a`)}
                </span>
              </div>
            </Col>
          </Row>
        );

      case OFFBOARDING.MEETING_STATUS.EMPLOYEE_PICK_DATE:
      case OFFBOARDING.MEETING_STATUS.DATE_CONFIRMED:
        return (
          <Row gutter={[24, 16]} className={styles.content} align="top">
            <Col span={10} lg={8}>
              <div className={styles.leftPart}>
                <span className={styles.label}>1-on-1 meeting with</span>
                <CustomEmployeeTag
                  title={employee?.titleInfo?.name}
                  name={getEmployeeName(employee?.generalInfoInfo)}
                  avatar={employee?.generalInfoInfo?.avatar}
                  userId={employee?.generalInfoInfo?.userId}
                />
              </div>
            </Col>
            <Col span={14} lg={16}>
              <div className={styles.rightPart}>
                <span className={styles.label}>Scheduled on</span>
                <span className={styles.time}>
                  {moment(employeeDate).format(`${DATE_FORMAT} | h:mm a`)}
                </span>
                {!isAccept && (
                  <div className={styles.notification}>
                    <span>Requestee scheduled 1-on-1 meeting with you</span>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        );

      default:
        return '';
    }
  };

  const renderButtons = () => {
    switch (meetingStatus) {
      case OFFBOARDING.MEETING_STATUS.NOT_START:
        return '';

      case OFFBOARDING.MEETING_STATUS.MANAGER_PICK_DATE:
        return (
          <div className={styles.actions}>
            <div className={styles.comment}>
              {isAccept && (
                <span onClick={() => setIsEnterClosingComment(true)}>Enter Closing Comments</span>
              )}
            </div>
            <div>
              <CustomSecondaryButton
                onClick={() => {
                  setOneOnOneMeetingModalVisible(true);
                }}
              >
                <span
                  style={{
                    color: '#2C6DF9',
                  }}
                >
                  Reschedule
                </span>
              </CustomSecondaryButton>
              <CustomPrimaryButton
                onClick={() => {
                  onJoinMeeting(meetingId);
                }}
              >
                Join with Google Meet
              </CustomPrimaryButton>
            </div>
          </div>
        );

      case OFFBOARDING.MEETING_STATUS.EMPLOYEE_PICK_DATE:
      case OFFBOARDING.MEETING_STATUS.DATE_CONFIRMED:
        return (
          <div className={styles.actions}>
            <div className={styles.comment}>
              {isAccept && (
                <span onClick={() => setIsEnterClosingComment(true)}>Enter Closing Comments</span>
              )}
            </div>
            <div>
              <CustomSecondaryButton
                onClick={() => {
                  setOneOnOneMeetingModalVisible(true);
                }}
              >
                <span
                  style={{
                    color: '#2C6DF9',
                  }}
                >
                  Reschedule
                </span>
              </CustomSecondaryButton>
              {!isAccept ? (
                <CustomPrimaryButton onClick={onAcceptMeeting}>Accept meeting</CustomPrimaryButton>
              ) : (
                <CustomPrimaryButton
                  onClick={() => {
                    onJoinMeeting(meetingId);
                  }}
                >
                  Join with Google Meet
                </CustomPrimaryButton>
              )}
            </div>
          </div>
        );

      default:
        return '';
    }
  };

  const renderModal = () => {
    return (
      <SetMeetingModal
        employee={employee}
        visible={oneOnOneMeetingModalVisible}
        onClose={() => setOneOnOneMeetingModalVisible(false)}
        title={`Set 1-on-1 with ${getEmployeeName(employee.generalInfoInfo)}`}
        partnerRole="Employee"
        onFinish={onSetOneOnOneMeeting}
        selectedDate={managerDate || employeeDate || null}
      />
    );
  };

  return (
    <Card title={renderTitle()} className={styles.WhatNext}>
      {renderContent()}
      {renderButtons()}
      {renderModal()}
    </Card>
  );
};

export default connect(({ offboarding }) => ({ offboarding }))(WhatNext);
