import React, { Component } from 'react';

import { connect } from 'umi';

import priorityIcon from '@/assets/ticketManagement-priority.svg';
import assignIcon from '@/assets/ticketManagement-assign.svg';
import unresolvedIcon from '@/assets/ticketManagement-unresolved.svg';

import styles from './index.less';

@connect()
class TicketInfo extends Component {
  render() {
    const { countData = [] } = this.props;
    return (
      <div className={styles.TicketInfo}>
        <div className={styles.ticketInfo__cart}>
          <div className={styles.assignIcon}>
            <img src={assignIcon} alt="assignIcon" />
          </div>
          <div className={styles.ticketInfo__name}>
            <h1>{countData.totalAssignee}</h1>
            <p>Assigned Tickets</p>
          </div>
        </div>
        <div className={styles.ticketInfo__cart}>
          <div className={styles.priorityIcon}>
            <img src={priorityIcon} alt="priorityIcon" />
          </div>
          <div className={styles.ticketInfo__name}>
            <h1>{countData.totalHigh}</h1>
            <p>High Priority Tickets</p>
          </div>
        </div>
        <div className={styles.ticketInfo__cart}>
          <div className={styles.unresolvedIcon}>
            <img src={unresolvedIcon} alt="unresolvedIcon" />
          </div>
          <div className={styles.ticketInfo__name}>
            {/* <h1>{countData.totalUnAssignee}</h1> */}
            <h1>N/A</h1>
            <p>Tickets out of SLA</p>
          </div>
        </div>
      </div>
    );
  }
}

export default TicketInfo;
