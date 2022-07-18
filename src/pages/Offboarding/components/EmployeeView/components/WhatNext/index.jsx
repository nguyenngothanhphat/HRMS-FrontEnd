import { Card, Avatar, Col, Row } from 'antd';
import React from 'react';
import moment from 'moment';
import { connect } from 'umi';
import avtDefault from '@/assets/avtDefault.jpg';
import styles from './index.less';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import { OFFBOARDING, onJoinMeeting } from '@/utils/offboarding';

const { MEETING_STATUS = {}, UPDATE_ACTION = {}, STATUS } = OFFBOARDING;

const WhatNext = (props) => {
  const {
    employee: {
      managerInfo: {
        generalInfoInfo: { legalName: managerName = '', avatar = '' } = {},
        titleInfo: { name: titleName = '' } = {},
      } = {},
    } = {},
    item: {
      meeting: {
        status: meetingStatus = '',
        employeeDate = '',
        managerDate,
        id: meetingId = '',
      } = {},
      _id = '',
      status = '',
      hrStatus = '',
      assigned: {
        hr: {
          generalInfoInfo: { legalName: hrName = '', avatar: avatarHr = '' } = {},
          titleInfo: { name: titleHr = '' } = {},
        } = {},
      } = {},
    } = {},
    getMyRequest = () => {},
    dispatch,
  } = props;

  const handleAcceptMeeting = () => {
    dispatch({
      type: 'offboarding/updateRequestEffect',
      payload: {
        action: UPDATE_ACTION.EMPLOYEE_ACCEPT_MEETING,
        meeting: {
          employeeDate: moment(employeeDate || managerDate),
        },
        id: _id,
      },
    }).then((res) => {
      const { statusCode = '' } = res;
      if (statusCode === 200) {
        getMyRequest();
      }
    });
  };

  const renderTimeMeeting = () => {
    if (
      meetingStatus === MEETING_STATUS.EMPLOYEE_PICK_DATE ||
      meetingStatus === MEETING_STATUS.DATE_CONFIRMED
    ) {
      return moment(employeeDate).format('YY-MM-DD | hA');
    }
    if (meetingStatus === MEETING_STATUS.MANAGER_PICK_DATE) {
      return moment(managerDate).format('YY-MM-DD | hA');
    }
    return '';
  };

  const renderWithStatus = (meetingStatusProp) => {
    switch (meetingStatusProp) {
      case MEETING_STATUS.EMPLOYEE_PICK_DATE:
        return (
          <div className={styles.labelStatus}>
            Waiting for {managerName} to Accept your meeting request.
          </div>
        );
      case MEETING_STATUS.MANAGER_PICK_DATE:
        return <div className={styles.labelStatus}>{managerName} has scheduled the meeting.</div>;
      case MEETING_STATUS.DATE_CONFIRMED:
        return (
          <div className={styles.labelStatus} style={{ background: 'rgb(0 197 152 / 13%)' }}>
            Meeting request has been accepted by {managerName}.
          </div>
        );
      case MEETING_STATUS.MANAGER_REJECT_DATE:
        return <div className={styles.labelStatus}>{managerName} has rescheduled the meeting.</div>;
      default:
        return '';
    }
  };

  const renderContent = () => {
    return (
      <Row gutter={[24, 16]} className={styles.content} align="top">
        {hrStatus === STATUS.IN_PROGRESS && status === STATUS.ACCEPTED ? (
          <Col span={10}>
            <div className={styles.leftPart}>
              <div className={styles.label}>HR Approval</div>
              <div className={styles.reporting}>
                <Avatar size={36} src={avatarHr || avtDefault} style={{ marginRight: '15px' }} />
                <div>
                  <div className={styles.legalName}>{hrName}</div>
                  <div className={styles.titleinfo}>{titleHr}</div>
                </div>
              </div>
            </div>
          </Col>
        ) : (
          <>
            <Col span={10}>
              <div className={styles.leftPart}>
                <div className={styles.label}>1-on-1 meeting with</div>
                <div className={styles.reporting}>
                  <Avatar size={36} src={avatar || avtDefault} style={{ marginRight: '15px' }} />
                  <div>
                    <div className={styles.legalName}>{managerName}</div>
                    <div className={styles.titleinfo}>{titleName}</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={10}>
              <div className={styles.leftPart}>
                <div className={styles.label}>1-on-1 meeting with</div>
                <div className={styles.reporting}>
                  <Avatar size={36} src={avatar || avtDefault} style={{ marginRight: '15px' }} />
                  <div>
                    <div className={styles.legalName}>{managerName}</div>
                    <div className={styles.titleinfo}>{titleName}</div>
                  </div>
                </div>
              </div>
            </Col>
            {meetingStatus !== MEETING_STATUS.NOT_START && status !== STATUS.REJECTED ? (
              <Col span={14}>
                <div className={styles.rightPart}>
                  <span className={styles.label}>Scheduled on</span>
                  <span className={styles.time}>{renderTimeMeeting()} </span>
                  <div className={styles.notification}>{renderWithStatus(meetingStatus)}</div>
                </div>
              </Col>
            ) : (
              ''
            )}
          </>
        )}
      </Row>
    );
  };

  const renderButtons = (meetingStatusProp) => {
    switch (meetingStatusProp) {
      case MEETING_STATUS.DATE_CONFIRMED:
      case MEETING_STATUS.EMPLOYEE_PICK_DATE:
        return (
          <div className={styles.actions}>
            <CustomPrimaryButton
              onClick={() => onJoinMeeting(meetingId)}
              disabled={meetingStatusProp === MEETING_STATUS.EMPLOYEE_PICK_DATE}
            >
              Join with Google Meet
            </CustomPrimaryButton>
          </div>
        );

      case MEETING_STATUS.MANAGER_REJECT_DATE:
      case MEETING_STATUS.MANAGER_PICK_DATE:
        return (
          <div className={styles.actions}>
            <CustomPrimaryButton className={styles.btn} onClick={handleAcceptMeeting}>
              Accept meeting
            </CustomPrimaryButton>
          </div>
        );

      default:
        return '';
    }
  };

  return (
    <div className={styles.WhatNext}>
      <Card title="What's next?">
        {renderContent()}
        {renderButtons(meetingStatus)}
      </Card>
    </div>
  );
};

export default connect()(WhatNext);
