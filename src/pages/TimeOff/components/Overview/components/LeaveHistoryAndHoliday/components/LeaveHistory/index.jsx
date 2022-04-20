import React, { PureComponent } from 'react';
import LeaveHistoryList from './components/LeaveHistoryList';
import LeaveHistoryCalendar from './components/LeaveHistoryCalendar';

export default class LeaveHistory extends PureComponent {
  render() {
    const { activeShowType = 1, leavingList = [], leavingListCalendar = [] } = this.props;
    return (
      <div>
        {activeShowType === 1 ? (
          <LeaveHistoryList leavingList={leavingList} />
        ) : (
          <LeaveHistoryCalendar leavingList={leavingListCalendar} />
        )}
      </div>
    );
  }
}
