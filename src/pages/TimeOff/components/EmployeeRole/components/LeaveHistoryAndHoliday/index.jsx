import React, { PureComponent } from 'react';
import { Tabs, Tooltip } from 'antd';
import CalendarIcon from '@/assets/calendar_icon.svg';
import ListIcon from '@/assets/list_icon.svg';
import { connect } from 'umi';
import moment from 'moment';
import Holiday from './components/Holiday';
import LeaveHistory from './components/LeaveHistory';
import styles from './index.less';

const { TabPane } = Tabs;
@connect(({ timeOff }) => ({
  timeOff,
}))
class LeaveHistoryAndHoliday extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeShowType: 1, // 1: list, 2: calendar
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/fetchHolidaysList',
      payload: { year: moment().format('YYYY'), month: '' },
    });
    dispatch({
      type: 'timeOff/fetchLeaveRequestOfEmployee',
    });
  };

  handleSelectShowType = (value) => {
    this.setState({
      activeShowType: value,
    });
  };

  operations = () => {
    const { activeShowType } = this.state;
    return (
      <div className={styles.menu}>
        <Tooltip title="List View">
          <img
            src={ListIcon}
            className={activeShowType === 1 ? styles.activeShowType : ''}
            onClick={() => this.handleSelectShowType(1)}
            alt="list"
          />
        </Tooltip>
        <Tooltip title="Calendar View">
          <img
            src={CalendarIcon}
            className={activeShowType === 2 ? styles.activeShowType : ''}
            onClick={() => this.handleSelectShowType(2)}
            alt="calendar"
          />
        </Tooltip>
      </div>
    );
  };

  // SORT BY DATE
  compareDates = (a, b) => {
    if (moment(a.fromDate).isBefore(moment(b.fromDate))) {
      return 1;
    }
    if (moment(a.fromDate).isAfter(moment(b.fromDate))) {
      return -1;
    }
    return 0;
  };

  formatHolidayLists = (holidaysList) => {
    let result = holidaysList.map((value) => {
      const { name = '', date = '' } = value;
      const fromDate = moment(date).locale('en').format('MM/DD/YYYY');
      return {
        name,
        fromDate,
      };
    });
    result = result.sort(this.compareDates);
    return result;
  };

  formatLeavingList = (leaveRequests) => {
    let result = leaveRequests.map((each) => {
      const {
        duration = 0,
        fromDate: from = '',
        toDate: to = '',
        subject = '',
        type: { shortType = '' } = {},
      } = each;

      const fromDate = moment(from).locale('en').format('MM/DD/YYYY');
      const toDate = moment(to).locale('en').format('MM/DD/YYYY');
      return {
        name: subject,
        fromDate,
        toDate,
        duration,
        type: shortType,
      };
    });
    result = result.sort(this.compareDates);
    return result;
  };

  render() {
    const { activeShowType } = this.state;
    const { timeOff: { holidaysList = [], leaveRequests = [] } = {} } = this.props;
    const formatHolidayLists = this.formatHolidayLists(holidaysList);
    const formatLeavingList = this.formatLeavingList(leaveRequests);

    return (
      <div className={styles.LeaveHistoryAndHoliday}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.operations()}>
          <TabPane tab="Request History" key="1">
            <LeaveHistory leavingList={formatLeavingList} activeShowType={activeShowType} />
          </TabPane>
          <TabPane tab="Holiday" key="2">
            <Holiday holidaysList={formatHolidayLists} activeShowType={activeShowType} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default LeaveHistoryAndHoliday;
