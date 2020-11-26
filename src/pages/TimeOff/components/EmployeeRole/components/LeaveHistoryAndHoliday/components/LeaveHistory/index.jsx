import React, { PureComponent } from 'react';
import LeaveHistoryList from './components/LeaveHistoryList';
import LeaveHistoryCalendar from './components/LeaveHistoryCalendar';
import styles from './index.less';

export default class LeaveHistory extends PureComponent {
  render() {
    const { activeShowType = 1, leavingList = [] } = this.props;
    return (
      <div className={styles.LeaveHistory}>
        {activeShowType === 1 ? (
          <LeaveHistoryList leavingList={leavingList} />
        ) : (
          <LeaveHistoryCalendar leavingList={leavingList} />
        )}
      </div>
    );
  }
}
