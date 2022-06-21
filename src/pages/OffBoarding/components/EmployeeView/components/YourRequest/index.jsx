import { Card, Col, Row, Divider, Avatar, Tooltip, Popover } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import { history, connect } from 'umi';
import avtDefault from '@/assets/defaultAvatar.png';
import IconPopup from '@/assets/offboarding/popupIcon.svg';
import styles from './index.less';
import { dateFormat, OFFBOARDING } from '@/utils/offboarding';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import SetMeetingModal from '../../../SetMeetingModal';

const { STATUS, MEETING_STATUS, UPDATE_ACTION } = OFFBOARDING;

const YourRequest = (props) => {
  const [visible, setVisible] = useState(false);
  const {
    data: {
      ticketId = '',
      createdAt = '',
      updatedAt = '',
      reason = '',
      LWD = '',
      _id = '',
      status = '',
      meeting: { status: meetingStatus = '' } = {},
      assigned: {
        hr: { generalInfoInfo: { avatar: avatarHr = '', legalName: hrName = '' } = {} } = {},
        manager: {
          generalInfoInfo: { avatar: avatarManager = '', legalName: managerName = '' } = {},
        } = {},
      } = {},
    } = {},
    employee: { managerInfo = {} } = {},
    getMyRequest = () => {},
    action = '',
    getRequestById = () => {},
    dispatch,
  } = props;

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
        if (action === 'request-detail') {
          getMyRequest();
        } else {
          getRequestById();
        }
        setVisible(false);
      }
    });
  };

  const renderTitle = (statusProps) => {
    switch (statusProps) {
      case STATUS.IN_PROGRESS:
      case STATUS.ACCEPTED:
        return 'Your Request';
      case STATUS.DRAFT:
        return 'Saved Draft';
      default:
        return '';
    }
  };

  const renderStatus = (statusProps) => {
    switch (statusProps) {
      case STATUS.DRAFT:
        return (
          <div className={styles.containerStatus}>
            <div>Status: </div>
            <div className={styles.statusDraft} />
            <div style={{ color: '#fd4546' }}>Draft</div>
          </div>
        );
      case STATUS.IN_PROGRESS:
        return (
          <div className={styles.containerStatus}>
            <div>Status: </div>
            <div className={styles.statusInProgress} />
            <div style={{ color: '#ffa100' }}>In Progress</div>
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
        return '';
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

  const handleEdit = () => {
    history.push(`/offboarding/my-request/edit/${_id}`);
  };

  const handleDelete = () => {
    dispatch({
      type: 'offboarding/withdrawRequestEffect',
      payload: {},
    }).then((res) => {
      const { statusCode = '' } = res;
      if (statusCode === 200) {
        if (action === 'request-detail') {
          getMyRequest();
        } else {
          history.push('/offboarding');
        }
      }
    });
  };

  const renderButton = (statusProps) => {
    switch (statusProps) {
      case STATUS.DRAFT:
        return (
          <div className={styles.containerBtn}>
            <div className={styles.btnEdit} onClick={handleEdit}>
              Back to edit
            </div>
            <div className={styles.btnDelete} onClick={handleDelete}>
              Delete
            </div>
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
              <div className={styles.btnDelete} onClick={handleDelete}>
                Withdraw
              </div>
            </div>
          );
        }
        return (
          <div className={styles.containerBtn}>
            <CustomSecondaryButton onClick={handleDelete}>Withdraw</CustomSecondaryButton>
            <CustomPrimaryButton onClick={() => setVisible(true)}>
              Schedule 1 on 1
            </CustomPrimaryButton>
          </div>
        );
      }
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
        return '';
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

  const renderContent = (statusProps) => {
    switch (statusProps) {
      case STATUS.DRAFT:
        return (
          <div className={styles.containerContent}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Row gutter={[24, 24]} align="middle">
                  <Col span={4} className={styles.title}>
                    Ticket ID
                  </Col>
                  <Col span={20} style={{ color: '#2c6df9' }}>
                    {ticketId}
                  </Col>
                  <Col span={4} className={styles.title}>
                    Last Edited
                  </Col>
                  <Col span={20} style={{ color: '#464646' }}>
                    {moment(updatedAt).format(dateFormat)}
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[24, 24]} align="top">
                  <Col span={4} className={styles.title}>
                    Reason
                  </Col>
                  <Col span={20} style={{ color: '#707177' }}>
                    {reason}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        );
      case STATUS.IN_PROGRESS:
      case STATUS.ACCEPTED:
      case STATUS.REJECTED:
        return (
          <div className={styles.containerContent}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Row gutter={[24, 24]} align="middle">
                  <Col span={4} className={styles.title}>
                    Ticket ID
                  </Col>
                  <Col span={20} style={{ color: '#2c6df9' }}>
                    {ticketId}
                  </Col>
                  <Col span={4} className={styles.title}>
                    Assigned
                  </Col>
                  <Col span={20} style={{ color: '#464646' }}>
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
                  </Col>
                  <Col span={4} className={styles.title}>
                    Requested on
                  </Col>
                  <Col span={20} style={{ color: '#464646' }}>
                    {moment(createdAt).format(dateFormat)}
                  </Col>
                  <Col span={4} className={styles.title}>
                    Tentative LWD
                  </Col>
                  <Col span={20} style={{ color: '#464646' }}>
                    {moment(LWD).format(dateFormat)}
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[24, 24]} align="top">
                  <Col span={4} className={styles.title}>
                    Reason
                  </Col>
                  <Col span={20} style={{ color: '#707177' }}>
                    {reason}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        );
      default:
        return '';
    }
  };

  return (
    <Card title={renderTitle(status)} extra={renderStatus(status)} className={styles.YourRequest}>
      {renderContent(status)}
      <Divider />
      {renderButton(status)}
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

export default connect()(YourRequest);
