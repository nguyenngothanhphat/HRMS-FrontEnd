import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany } from '@/utils/authority';
import Header from './components/Header';
import TimelineTable from './components/TimelineTable';
import styles from './index.less';
import { dateFormatAPI, convertMsToTime } from '@/utils/timeSheet';

const MyTimeSheet = (props) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [myTotalHours, setMyTotalHours] = useState('');
  const { dispatch, employee: { _id: employeeId = '' } = {}, myTimesheet = [], currentDateProp = '', } = props;
  // FUNCTION AREA
  const fetchMyTimesheetEffect = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
      },
    });
  };

  const calculateTotalHours = (list) => {
    let duration = 0;
    list.forEach((item) => {
      const { timesheet = [] } = item;
      timesheet.forEach((v) => {
        duration += v.duration;
      });
    });
    return convertMsToTime(duration);
    // return moment.utc(duration).format('HH:mm:ss');
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (startDate && endDate) {
      fetchMyTimesheetEffect();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const totalHours = calculateTotalHours(myTimesheet);
    setMyTotalHours(totalHours);
  }, [JSON.stringify(myTimesheet)]);

  useEffect(() => {
    const lastSunday = moment().weekday(1);
    const currentSunday = moment().weekday(7);
    setStartDate(lastSunday);
    setEndDate(currentSunday);
    return () => {};
  }, []);

  useEffect(() => {
    if (currentDateProp) {
      setStartDate(moment(currentDateProp));
    }
  }, [currentDateProp]);

  // MAIN AREA
  return (
    <div className={styles.MyTimeSheet}>
      <Header
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        myTotalHours={myTotalHours}
      />
      <TimelineTable startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default connect(
  ({ timeSheet: { myTimesheet = [] } = {}, user: { currentUser: { employee = {} } = {} } }) => ({
    employee,
    myTimesheet,
  }),
)(MyTimeSheet);
