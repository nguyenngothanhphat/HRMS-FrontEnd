import React, { PureComponent } from 'react';
import { Tabs, Tooltip } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import CalendarIcon from '@/assets/calendar_icon.svg';
import ListIcon from '@/assets/list_icon.svg';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import { getCurrentCompany, getCurrentLocation } from '@/utils/authority';
import Holiday from './components/Holiday';
import LeaveHistory from './components/LeaveHistory';
import styles from './index.less';

const { TabPane } = Tabs;

const { IN_PROGRESS, IN_PROGRESS_NEXT, ACCEPTED, ON_HOLD, REJECTED, DELETED, DRAFTS } =
  TIMEOFF_STATUS;
@connect(({ timeOff, user: { currentUser: { location = {} } = {} } = {} }) => ({
  timeOff,
  location,
}))
class LeaveHistoryAndHoliday extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeShowType: 1, // 1: list, 2: calendar
    };
  }

  componentDidMount = () => {
    const { dispatch, location = {} } = this.props;
    dispatch({
      type: 'timeOff/fetchHolidaysListBylocation',
      payload: {
        location: getCurrentLocation(),
        country: location.headQuarterAddress.country._id,
        company: getCurrentCompany(),
      },
    });
    dispatch({
      type: 'timeOff/fetchLeaveHistory',
      status: '',
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
        {/* {activeShowType === 2 && ( */}
        <Tooltip title="List View">
          <div className={styles.iconContainer}>
            <img
              src={ListIcon}
              className={activeShowType === 1 ? styles.activeShowType : ''}
              onClick={() => this.handleSelectShowType(1)}
              alt="list"
            />
          </div>
        </Tooltip>
        {/* )} */}
        {/* {activeShowType === 1 && ( */}
        <Tooltip title="Calendar View">
          <div className={styles.iconContainer}>
            <img
              src={CalendarIcon}
              className={activeShowType === 2 ? styles.activeShowType : ''}
              onClick={() => this.handleSelectShowType(2)}
              alt="calendar"
            />
          </div>
        </Tooltip>
        {/* )} */}
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
    return holidaysList.sort(
      (a, b) => moment(a.date.iso).format('YYYYMMDD') - moment(b.date.iso).format('YYYYMMDD'),
    );
  };

  formatLeavingList = (allLeaveRequests) => {
    let result = allLeaveRequests.map((each) => {
      const {
        status = '',
        duration = 0,
        fromDate: from = '',
        toDate: to = '',
        type: { name: typeName = '' } = {},
        _id = '',
        subject = '',
      } = each;

      if (
        status === ACCEPTED ||
        status === REJECTED ||
        status === IN_PROGRESS ||
        status === IN_PROGRESS_NEXT
      ) {
        const fromDate = moment.utc(from).locale('en').format('MM/DD/YYYY');
        const toDate = moment.utc(to).locale('en').format('MM/DD/YYYY');
        // const now = moment.utc().locale('en').format('MM/DD/YYYY');
        // if (moment.utc(now).isAfter(moment.utc(toDate))) {
        //   return {
        //     _id,
        //     name: subject,
        //     fromDate,
        //     toDate,
        //     duration,
        //     type: shortType,
        //   };
        // }
        return {
          _id,
          fromDate,
          toDate,
          duration,
          typeName,
          status,
          subject,
        };
      }
      return null;
    });
    result = result.filter((value) => value !== null);
    result = result.sort(this.compareDates);
    return result;
  };

  formatLeavingListCalendar = (allLeaveRequests) => {
    let result = allLeaveRequests.map((each) => {
      const {
        status = '',
        duration = 0,
        fromDate: from = '',
        toDate: to = '',
        type: { name: typeName = '' } = {},
        _id = '',
        subject,
      } = each;

      if (status !== DRAFTS && status !== ON_HOLD && status !== DELETED && status !== REJECTED) {
        const fromDate = moment.utc(from).locale('en').format('MM/DD/YYYY');
        const toDate = moment.utc(to).locale('en').format('MM/DD/YYYY');
        return {
          _id,
          fromDate,
          toDate,
          duration,
          typeName,
          status,
          subject,
        };
      }
      return null;
    });
    result = result.filter((value) => value !== null);
    result = result.sort(this.compareDates);
    return result;
  };

  render() {
    const { activeShowType } = this.state;
    const { timeOff: { holidaysListByLocation = [], leaveHistory = [] } = {} } = this.props;
    const currentDate = new Date().toISOString();
    const newHolidaysListByLocation = holidaysListByLocation.filter(
      (date) => date.date.iso >= currentDate,
    );
    const formatHolidayLists = this.formatHolidayLists(newHolidaysListByLocation);
    const formatLeavingList = this.formatLeavingList(leaveHistory);
    const formatLeavingListCalendar = this.formatLeavingListCalendar(leaveHistory);

    return (
      <div className={styles.LeaveHistoryAndHoliday}>
        <Tabs destroyInactiveTabPane defaultActiveKey="1" tabBarExtraContent={this.operations()}>
          <TabPane tab="Time off Calendar" key="1">
            <LeaveHistory
              leavingListCalendar={formatLeavingListCalendar}
              leavingList={formatLeavingList}
              activeShowType={activeShowType}
            />
          </TabPane>
          <TabPane tab="Holidays" key="2">
            <Holiday holidaysList={formatHolidayLists} activeShowType={activeShowType} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default LeaveHistoryAndHoliday;
