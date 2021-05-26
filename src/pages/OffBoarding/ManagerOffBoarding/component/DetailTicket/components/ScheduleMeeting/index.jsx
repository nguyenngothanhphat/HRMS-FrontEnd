import React, { Component } from 'react';
import { formatMessage, connect } from 'umi';
import { Modal } from 'antd';
import moment from 'moment';
import externalLinkIcon from '@/assets/external-link.svg';
import { checkTime } from '@/utils/utils';
import AddComment from '../AddComment';
import styles from './index.less';

@connect(({ user: { currentUser: { employee: { _id: myId = '' } = {} } = {} } = {} }) => ({
  myId,
}))
class ScheduleMeeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddComment: false,
    };
  }

  handleAddComment = () => {
    this.setState({
      isAddComment: true,
    });
  };

  modalWarning = () => {
    Modal.warning({
      title: 'Comment after date, time meeting 1 on 1',
    });
  };

  render() {
    const { isAddComment = false } = this.state;
    const { data = {}, myId = '', isHRManager = false } = this.props;
    const {
      meetingDate = '',
      meetingTime = '',
      createdBy: { generalInfo: { firstName = '', workEmail: email = '' } = {} } = {},
      assignee: {
        _id: assigneeId = '',
        generalInfo: { firstName: nameAssignee = '', workEmail: emailAssignee = '' } = {},
      } = {},
      _id = '',
      ownerComment: {
        _id: ownerCommentId = '',
        generalInfo: { firstName: nameOwner = '' } = {},
      } = {},
    } = data;
    const checkOwner = myId === ownerCommentId;
    if (isAddComment) {
      return <AddComment idComment={_id} nameOwner={nameOwner} isHRManager={isHRManager} />;
    }
    const check = checkTime(meetingDate, meetingTime);
    return (
      <div className={styles.actionDetailTicket__schedule}>
        <div className={styles.schedule__content}>
          <span className={styles.actionDetailTicket__title}>
            {formatMessage({ id: 'pages.offBoarding.1on1Meeting' })} with{' '}
            <span className={styles.name}>{firstName}</span>
          </span>
          <div className={styles.actionDetailTicket__dateTime}>
            {/* <span>
              {formatMessage({ id: 'pages.offBoarding.scheduledOn' })}:{' '}
              {moment(meetingDate).format('YYYY/MM/DD')} &nbsp; | &nbsp; <span>{meetingTime}</span>
            </span> */}
            {checkOwner && (
              <div
                className={styles.addCommentBtn}
                onClick={check ? this.handleAddComment : this.modalWarning}
              >
                <span className={styles.text}>Enter Closing Comments</span>
                <img
                  className={styles.icon__external__link}
                  src={externalLinkIcon}
                  alt="external-link-icon"
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.scheduleTime}>
          Schedule on: {moment(meetingDate).format('MM.DD.YY')} &nbsp; | &nbsp;{' '}
          <span>{meetingTime}</span>
        </div>
        {/* <div>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Created by:</span> {firstName} (
          {email})
        </div> */}
        {assigneeId && (
          <div className={styles.assignee}>
            <span>Assignee:</span> <span className={styles.assigneeName}>{nameAssignee}</span> (
            {emailAssignee})
          </div>
        )}
      </div>
    );
  }
}

export default ScheduleMeeting;
