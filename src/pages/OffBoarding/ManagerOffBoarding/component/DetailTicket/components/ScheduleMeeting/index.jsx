import React, { Component } from 'react';
import { formatMessage, connect } from 'umi';
import moment from 'moment';
import externalLinkIcon from '@/assets/external-link.svg';
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

  render() {
    const { isAddComment = false } = this.state;
    const { data = {}, myId = '' } = this.props;
    const {
      meetingDate = '',
      meetingTime = '',
      createdBy: { generalInfo: { firstName = '', workEmail: email = '' } = {} } = {},
      assignee: {
        _id: assigneeId = '',
        generalInfo: { firstName: nameAssignee = '', workEmail: emailAssignee = '' } = {},
      } = {},
      _id = '',
      ownerComment: { _id: ownerCommentId = '' } = {},
    } = data;
    const checkOwner = myId === ownerCommentId;
    if (isAddComment) {
      return <AddComment idComment={_id} />;
    }
    return (
      <div className={styles.actionDetailTicket__schedule} style={{ marginBottom: '15px' }}>
        <div className={styles.schedule__content}>
          <span className={styles.actionDetailTicket__title}>
            {formatMessage({ id: 'pages.offBoarding.1on1Meeting' })}
          </span>
          <div className={styles.actionDetailTicket__dateTime}>
            <span>
              {formatMessage({ id: 'pages.offBoarding.scheduledOn' })} :{' '}
              {moment(meetingDate).format('YYYY/MM/DD')} &nbsp; | &nbsp; <span>{meetingTime}</span>
            </span>
            {checkOwner && (
              <span className={styles.icon__external__link}>
                <img
                  src={externalLinkIcon}
                  alt="external-link-icon"
                  onClick={this.handleAddComment}
                />
              </span>
            )}
          </div>
        </div>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Created by:</span> {firstName} (
          {email})
        </div>
        {assigneeId && (
          <div>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Assignee:</span> {nameAssignee} (
            {emailAssignee})
          </div>
        )}
      </div>
    );
  }
}

export default ScheduleMeeting;
