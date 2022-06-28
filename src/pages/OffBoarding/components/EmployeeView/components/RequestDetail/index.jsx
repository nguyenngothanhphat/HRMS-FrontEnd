import { Avatar, Card, Col, Popover, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, history } from 'umi';
import avtDefault from '@/assets/defaultAvatar.png';
import IconPopup from '@/assets/offboarding/popupIcon.svg';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { dateFormat, OFFBOARDING, onJoinMeeting } from '@/utils/offboarding';

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
      LWD = '',
      reason = '',
      status = '',
      _id = '',
      meeting: { status: meetingStatus = '' },
      assigned: {
        hr: { generalInfoInfo: { avatar: avatarHr = '', legalName: hrName = '' } = {} } = {},
        manager: {
          generalInfoInfo: { avatar: avatarManager = '', legalName: managerName = '' } = {},
        } = {},
      } = {},
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
    switch (statusProp) {
      case STATUS.DRAFT:
        return (
          <div className={styles.containerStatus}>
            <div>Status: </div>
            <div className={styles.statusDraft} />
            <div style={{ color: '#fd4546' }}>Draft</div>
          </div>
        );
      case STATUS.ACCEPTED:
        return (
          <div className={styles.containerStatus}>
            <div>Status: </div>
            <div className={styles.statusAccepted} />
            <div style={{ color: '#00C598' }}>Accepted</div>
          </div>
        );
      case STATUS.REJECTED:
        return (
          <div className={styles.containerStatus}>
            <div>Status: </div>
            <div className={styles.statusDraft} />
            <div style={{ color: '#fd4546' }}>Rejected</div>
          </div>
        );
      default:
        return (
          <div className={styles.containerStatus}>
            <div>Status: </div>
            <div className={styles.statusInProgress} />
            <div style={{ color: '#ffa100' }}>In Progress</div>
          </div>
        );
    }
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
        if (meetingStatus === MEETING_STATUS.DATE_CONFIRMED) {
          return (
            <div className={styles.containerBtn}>
              <CustomSecondaryButton onClick={handleWithdraw} loading={loadingWithdraw}>
                Withdraw
              </CustomSecondaryButton>
              <CustomPrimaryButton onClick={() => onJoinMeeting(123)}>
                Join with Google Meet
              </CustomPrimaryButton>
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
      case STATUS.REJECTED:
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

  const renderAvatar = () => {
    return (
      <>
        <Tooltip placement="top" title={hrName}>
          <Avatar size={21} src={avatarHr || avtDefault} />
        </Tooltip>
        <Tooltip placement="top" title={managerName}>
          <Avatar size={21} src={avatarManager || avtDefault} />
        </Tooltip>
      </>
    );
  };

  return (
    <Card title="Your Request" extra={renderStatus(status)} className={styles.RequestDetail}>
      <div style={{ margin: '24px', fontSize: '13px' }}>
        <Row gutter={[24, 24]}>
          <Col className={styles.containerInfo} span={24}>
            <Row gutter={[24, 24]} justify="space-between">
              <Col span={8} xs={24} md={8}>
                <div className={styles.item}>
                  <span className={styles.title}>Ticket ID:</span>
                  <span
                    onClick={handleTicketDetail}
                    style={{ color: '#2c6df9', cursor: 'pointer' }}
                  >
                    {ticketId}
                  </span>
                </div>
              </Col>
              <Col span={8} xs={24} md={8}>
                <div className={styles.item} style={{ display: 'flex' }}>
                  <span className={styles.title}>Assigned:</span>
                  <span>
                    <div style={{ alignItem: 'center', display: 'flex' }}>
                      <Avatar.Group
                        maxStyle={{
                          color: '#f56a00',
                          backgroundColor: '#fde3cf',
                        }}
                      >
                        {renderAvatar()}
                      </Avatar.Group>
                    </div>
                  </span>
                </div>
              </Col>
              <Col span={8} xs={24} md={8}>
                <div className={styles.item}>
                  <span className={styles.title}>Tentative Last Working Date:</span>
                  <span style={{ color: '#464646' }}>{moment(LWD).format(dateFormat)}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24} className={styles.title}>
            Reason for leaving us?
          </Col>
          <Col span={24} style={{ color: '#707177' }}>
            {reason}
          </Col>
        </Row>
      </div>

      {renderButton(meetingStatus)}

      <SetMeetingModal
        visible={visible}
        title="Set 1-on1 with Manager"
        onClose={() => setVisible(false)}
        partnerRole="Manager"
        employee={managerInfo}
        onFinish={onFinish}
      />
    </Card>
  );
};

export default connect(({ loading }) => ({
  loadingSchedule: loading.effects['offboarding/createMeeting'],
  loadingWithdraw: loading.effects['offboarding/createRequestEffect'],
}))(RequestDetail);
