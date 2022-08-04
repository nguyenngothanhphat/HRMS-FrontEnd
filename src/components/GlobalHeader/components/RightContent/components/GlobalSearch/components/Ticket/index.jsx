import React from 'react';
import { Avatar } from 'antd';
import { history, connect } from 'umi';
import styles from './index.less';
import ticketIcon from '../icon/ticket.svg';

const Ticket = (props) => {
  const {
    id,
    ticketId,
    title,
    onClick,
    employee: { _id: employeeId },
    currentUser,
  } = props;
  const onClickTicket = () => {
    let path = '';
    switch (title) {
      case 'Offboarding Request':
        path = `/offboarding/list/review/${id}`;
        break;
      case 'Leave Request':
      case 'Compoff Request':
        if (employeeId === currentUser?._id)
          path = `/time-off/overview/personal-timeoff/view/${id}`;
        else path = `/time-off/overview/manager-timeoff/view/${id}`;
        break;
      case 'Onboarding Ticket':
        path = `/onboarding/list/view/${ticketId}`;
        break;
      default:
        break;
    }
    onClick();
    history.push(path);
  };
  return (
    <div className={styles.ticket} onClick={onClickTicket}>
      <Avatar src={ticketIcon} style={{ backgroundColor: '#E6EDFE', margin: '12px' }} />
      <div className={styles.ticket__main}>
        <div className={styles.header}>{ticketId}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
};
export default connect(({ user: { currentUser: { employee: currentUser = {} } = {} } }) => ({
  currentUser,
}))(Ticket);
