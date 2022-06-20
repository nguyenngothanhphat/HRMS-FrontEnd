import { Card, Col, Row, Popover } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, history } from 'umi';
import { dateFormat, OFFBOARDING } from '@/utils/offboarding';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import IconPopup from '@/assets/offboarding/popupIcon.svg';

import SetMeetingModal from '../../../SetMeetingModal';

import styles from './index.less';

const { STATUS, UPDATE_ACTION, MEETING_STATUS } = OFFBOARDING;
const RequestDetail = (props) => {
  const {
    loadingSchedule = false,
    loadingWithdraw = false,
    employee: { managerInfo = {} } = {},
    dispatch,
    data: {
      ticketId = '',
      createdAt = '',
      LWD = '',
      reason = '',
      status = '',
      _id = '',
      meeting: { status: meetingStatus = '' },
    } = {},
    getMyRequest = () => {},
  } = props;

  const [visible, setVisible] = useState(false);

  const onFinish = (values = {}) => {
    dispatch({
      type: 'offboarding/updateRequestEffect',
      payload: {
        action: UPDATE_ACTION.EMPLOYEE_RESCHEDULE,
        meeting: {
          employeeDate: moment(values.time),
        },
        id: _id,
      },
    }).then((res) => {
      const { statusCode = '' } = res;
      if (statusCode === 200) {
        getMyRequest();
        setVisible(false);
      }
    });
  };

  const handleWithdraw = () => {
    dispatch({
      type: 'offboarding/withdrawRequestEffect',
      payload: {},
    }).then((res) => {
      const { statusCode = '' } = res;
      if (statusCode === 200) {
        getMyRequest();
      }
    });
  };

  const handleTicketDetail = () => {
    history.push(`/offboarding/my-request/review-ticket/${_id}`);
  };

  const renderStatus = (statusProp) => {
    if (statusProp === STATUS.DRAFT) {
      return (
        <div className={styles.containerStatus}>
          <div>Status: </div>
          <div className={styles.statusDraft} />
          <div style={{ color: '#fd4546' }}>Draft</div>
        </div>
      );
    }
    if (statusProp === STATUS.ACCEPTED) {
      return (
        <div className={styles.containerStatus}>
          <div>Status: </div>
          <div className={styles.statusAccepted} />
          <div style={{ color: '#00C598' }}>Accepted</div>
        </div>
      );
    }
    return (
      <div className={styles.containerStatus}>
        <div>Status: </div>
        <div className={styles.statusInProgress} />
        <div style={{ color: '#ffa100' }}>In Progress</div>
      </div>
    );
  };

  const renderPopover = () => {
    return (
      <div>
        Resignation requests cannot be Withdrawn after the Manager approves. Please talk to the HR
        to make changes to your request.
      </div>
    );
  };

  const renderButton = () => {
    switch (status) {
      case STATUS.ACCEPTED:
        return (
          <div className={styles.containerBtn}>
            <Popover
              trigger="hover"
              placement="left"
              content={renderPopover()}
              overlayClassName={styles.contentPopover}
            >
              <img src={IconPopup} alt="" />
            </Popover>
            <div className={styles.btnWithdrawDisable}>Withdraw </div>
          </div>
        );
      case STATUS.IN_PROGRESS: {
        if (
          meetingStatus === MEETING_STATUS.DATE_CONFIRMED ||
          meetingStatus === MEETING_STATUS.EMPLOYEE_PICK_DATE ||
          meetingStatus === MEETING_STATUS.MANAGER_PICK_DATE
        ) {
          return (
            <div className={styles.containerBtnWithdraw}>
              <CustomSecondaryButton
                paddingInline={0}
                onClick={handleWithdraw}
                loading={loadingWithdraw}
              >
                <span className={styles.labelBtn}> Withdraw</span>
              </CustomSecondaryButton>
            </div>
          );
        }
        return (
          <div className={styles.containerBtn}>
            <CustomSecondaryButton onClick={handleWithdraw} loading={loadingWithdraw}>
              Withdraw
            </CustomSecondaryButton>
            <CustomPrimaryButton onClick={() => setVisible(true)} loading={loadingSchedule}>
              Schedule 1 on 1
            </CustomPrimaryButton>
          </div>
        );
      }

      default:
        return (
          <div className={styles.containerBtn}>
            <CustomSecondaryButton onClick={handleWithdraw} loading={loadingWithdraw}>
              Withdraw
            </CustomSecondaryButton>
            <CustomPrimaryButton onClick={() => setVisible(true)} loading={loadingSchedule}>
              Schedule 1 on 1
            </CustomPrimaryButton>
          </div>
        );
    }
  };

  return (
    <div className={styles.RequestDetail}>
      <Card title="Your Request" extra={renderStatus(status)}>
        <div className={styles.container}>
          <Row gutter={[24, 24]}>
            <div className={styles.containerInfo}>
              <div>
                <span className={styles.title}>Ticket ID:</span>
                <span onClick={handleTicketDetail} style={{ color: '#2c6df9', cursor: 'pointer' }}>
                  {ticketId}
                </span>
              </div>
              <div>
                <span className={styles.title}>Assigned:</span>
                <span style={{ color: '#464646' }}>{moment(createdAt).format(dateFormat)}</span>
              </div>
              <div>
                <span className={styles.title}>Tentative Last Working Date:</span>
                <span style={{ color: '#464646' }}>{moment(LWD).format(dateFormat)}</span>
              </div>
            </div>
            <Col span={24} className={styles.title}>
              Reason for leaving us?
            </Col>
            <Col span={24} style={{ color: '#707177' }}>
              {reason}
            </Col>
          </Row>
        </div>

        {renderButton()}
      </Card>
      <SetMeetingModal
        visible={visible}
        title="Set 1-on1 with Manager"
        onClose={() => setVisible(false)}
        partnerRole="Manager"
        employee={managerInfo}
        onFinish={onFinish}
      />
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingSchedule: loading.effects['offboarding/createMeeting'],
  loadingWithdraw: loading.effects['offboarding/createRequestEffect'],
}))(RequestDetail);
