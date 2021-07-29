import React, { PureComponent } from 'react';
import { Tabs, Tooltip } from 'antd';
import CalendarIcon from '@/assets/calendar_icon.svg';
import ListIcon from '@/assets/list_icon.svg';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import { connect } from 'umi';
import moment from 'moment';
import { getCurrentCompany, getCurrentLocation } from '@/utils/authority';
import Holiday from './components/Holiday';
import LeaveHistory from './components/LeaveHistory';
import styles from './index.less';

const { TabPane } = Tabs;
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
        {activeShowType === 2 && (
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
        )}
        {activeShowType === 1 && (
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
        )}
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

  formatLeavingList = (allLeaveRequests) => {
    let result = allLeaveRequests.map((each) => {
      const {
        status = '',
        duration = 0,
        fromDate: from = '',
        toDate: to = '',
        subject = '',
        type: { shortType = '' } = {},
        _id = '',
      } = each;

      if (status === TIMEOFF_STATUS.accepted) {
        const fromDate = moment(from).locale('en').format('MM/DD/YYYY');
        const toDate = moment(to).locale('en').format('MM/DD/YYYY');
        // const now = moment().locale('en').format('MM/DD/YYYY');
        // if (moment(now).isAfter(moment(toDate))) {
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
          name: subject,
          fromDate,
          toDate,
          duration,
          type: shortType,
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
    const {
      timeOff: { holidaysListByLocation = [], allMyLeaveRequests: { items = [] } = {} } = {},
    } = this.props;
    // const formatHolidayLists = this.formatHolidayLists(holidaysList);
    const formatLeavingList = this.formatLeavingList(items);

    return (
      <div className={styles.LeaveHistoryAndHoliday}>
        <Tabs destroyInactiveTabPane defaultActiveKey="1" tabBarExtraContent={this.operations()}>
          <TabPane tab="Time off Calendar" key="1">
            <LeaveHistory leavingList={formatLeavingList} activeShowType={activeShowType} />
          </TabPane>
          <TabPane tab="Holidays" key="2">
            <Holiday holidaysList={holidaysListByLocation} activeShowType={activeShowType} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default LeaveHistoryAndHoliday;
