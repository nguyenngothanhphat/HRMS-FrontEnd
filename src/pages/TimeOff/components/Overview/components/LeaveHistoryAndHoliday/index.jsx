import { Spin, Tabs, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CalendarIcon from '@/assets/calendar_icon.svg';
import ListIcon from '@/assets/list_icon.svg';
import { getCurrentCompany, getCurrentLocation } from '@/utils/authority';
import {
  checkNormalTypeTimeoff,
  isFutureDay,
  TIMEOFF_DATE_FORMAT,
  TIMEOFF_STATUS,
  TIMEOFF_TYPE,
} from '@/utils/timeOff';
import styles from './index.less';
import HolidayList from './components/HolidayList';
import HolidayCalendar from './components/HolidayCalendar';
import LeaveHistoryList from './components/LeaveHistoryList';
import LeaveHistoryCalendar from './components/LeaveHistoryCalendar';

const { TabPane } = Tabs;

const { IN_PROGRESS, IN_PROGRESS_NEXT, ACCEPTED, ON_HOLD, REJECTED, DELETED, DRAFTS, WITHDRAWN } =
  TIMEOFF_STATUS;

const LeaveHistoryAndHoliday = (props) => {
  const {
    timeOff: { holidaysListByLocation = [], leaveHistory = [] } = {},
    loadingFetch = false,
    dispatch,
    location = {},
  } = props;

  const [activeShowType, setActiveShowType] = useState(1); // 1: list, 2: calendar
  const [allHolidayList, setAllHolidayList] = useState([]);
  const [upcomingHolidayList, setUpcomingHolidayList] = useState([]);
  const [leaveRequestList, setLeaveRequestList] = useState([]);
  const [leaveRequestCalendarList, setLeaveRequestCalendarList] = useState([]);

  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    dispatch({
      type: 'timeOff/fetchHolidaysListByLocation',
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
  }, []);

  const handleSelectShowType = (value) => {
    setActiveShowType(value);
  };

  const operations = () => {
    return (
      <div className={styles.menu}>
        <Tooltip title="List View">
          <div className={styles.iconContainer}>
            <img
              src={ListIcon}
              className={activeShowType === 1 ? styles.activeShowType : ''}
              onClick={() => handleSelectShowType(1)}
              alt="list"
            />
          </div>
        </Tooltip>
        <Tooltip title="Calendar View">
          <div className={styles.iconContainer}>
            <img
              src={CalendarIcon}
              className={activeShowType === 2 ? styles.activeShowType : ''}
              onClick={() => handleSelectShowType(2)}
              alt="calendar"
            />
          </div>
        </Tooltip>
      </div>
    );
  };

  // SORT BY DATE
  const compareDates = (a, b) => {
    if (moment(a.fromDate).isBefore(moment(b.fromDate))) {
      return 1;
    }
    if (moment(a.fromDate).isAfter(moment(b.fromDate))) {
      return -1;
    }
    return 0;
  };

  const formatHolidayLists = (list) => {
    return list.sort(
      (a, b) => moment(a.date.iso).format('YYYYMMDD') - moment(b.date.iso).format('YYYYMMDD'),
    );
  };

  const formatLeavingList = (list) => {
    let result = list.map((each) => {
      const {
        status = '',
        duration = 0,
        fromDate: from = '',
        toDate: to = '',
        type: { name: typeName = '', type = '' } = {},
        _id = '',
        subject = '',
        leaveDates = [],
      } = each;

      if (
        status === ACCEPTED ||
        status === REJECTED ||
        status === IN_PROGRESS ||
        status === IN_PROGRESS_NEXT
      ) {
        const listLeave = leaveDates.sort((a, b) => moment(a.date) - moment(b.date));
        const fromDate = from
          ? moment(from).locale('en').format(TIMEOFF_DATE_FORMAT)
          : moment(listLeave[0].date).locale('en').format(TIMEOFF_DATE_FORMAT);
        const toDate = to
          ? moment(to).locale('en').format(TIMEOFF_DATE_FORMAT)
          : moment(listLeave[listLeave.length - 1].date)
              .locale('en')
              .format(TIMEOFF_DATE_FORMAT);
        if (!from && !to && checkNormalTypeTimeoff(type)) {
          return {
            _id,
            leaveDates: listLeave,
            normalType: checkNormalTypeTimeoff(type),
            duration,
            typeName,
            status,
            subject,
            fromDate,
            toDate,
          };
        }
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
    result = result.sort(compareDates);
    return result;
  };

  const formatLeavingListCalendar = (list) => {
    let result = list.map((each) => {
      const {
        status = '',
        duration = 0,
        fromDate: from = '',
        toDate: to = '',
        type: { name: typeName = '', type = '' } = {},
        _id = '',
        subject,
        leaveDates = [],
      } = each;

      if (status !== DRAFTS && status !== ON_HOLD && status !== DELETED && status !== WITHDRAWN) {
        const fromDate = moment(from).locale('en').format(TIMEOFF_DATE_FORMAT);
        const toDate = moment(to).locale('en').format(TIMEOFF_DATE_FORMAT);
        const listLeave = leaveDates
          .sort((a, b) => moment(a.date) - moment(b.date))
          .map((x) => x.date);
        if (!from && !to && checkNormalTypeTimeoff(type)) {
          return {
            _id,
            listLeave,
            duration,
            typeName,
            status,
            subject,
            leaveDates,
          };
        }
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
    result = result.sort(compareDates);
    return result;
  };

  useEffect(() => {
    const arr1 = formatHolidayLists(
      holidaysListByLocation.filter((x) => isFutureDay(moment(x.date?.iso, 'YYYY-MM-DD'))),
    );
    const arr2 = formatHolidayLists(holidaysListByLocation);

    setUpcomingHolidayList(arr1);
    setAllHolidayList(arr2);
  }, [JSON.stringify(holidaysListByLocation)]);

  useEffect(() => {
    const arr1 = formatLeavingList(leaveHistory);
    const arr2 = formatLeavingListCalendar(leaveHistory);

    setLeaveRequestList(arr1);
    setLeaveRequestCalendarList(arr2);
  }, [JSON.stringify(leaveHistory)]);

  return (
    <div className={styles.LeaveHistoryAndHoliday}>
      <Tabs defaultActiveKey="1" tabBarExtraContent={operations()}>
        <TabPane tab="Time off Calendar" key="1">
          <Spin spinning={loadingFetch}>
            {activeShowType === 1 ? (
              <LeaveHistoryList leavingList={leaveRequestList} />
            ) : (
              <LeaveHistoryCalendar
                leavingList={leaveRequestCalendarList}
                allHolidayList={allHolidayList}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
              />
            )}
          </Spin>
        </TabPane>
        <TabPane tab="Holidays" key="2">
          <Spin spinning={loadingFetch}>
            {activeShowType === 1 ? (
              <HolidayList upcomingHolidayList={upcomingHolidayList} />
            ) : (
              <HolidayCalendar
                allHolidayList={allHolidayList}
                leavingList={leaveRequestList}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
              />
            )}
          </Spin>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default connect(
  ({ loading, timeOff, user: { currentUser: { location = {} } = {} } = {} }) => ({
    timeOff,
    location,
    loadingFetch:
      loading.effects['timeOff/fetchLeaveHistory'] ||
      loading.effects['timeOff/fetchHolidaysListByLocation'],
  }),
)(LeaveHistoryAndHoliday);
