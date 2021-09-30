import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany } from '@/utils/authority';
import Header from './components/Header';
import TimelineTable from './components/TimelineTable';
import styles from './index.less';

const MyTimeSheet = (props) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { dispatch, employee: { _id: employeeId = '' } = {} } = props;
  // FUNCTION AREA
  const fetchMyTimesheetEffect = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
      },
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    fetchMyTimesheetEffect();
  }, []);

  useEffect(() => {
    const lastSunday = moment().weekday(1);
    const currentSunday = moment().weekday(7);
    setStartDate(lastSunday);
    setEndDate(currentSunday);
    return () => {};
  }, []);

  // MAIN AREA
  return (
    <div className={styles.MyTimeSheet}>
      <Header
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <TimelineTable startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  MyTimeSheet,
);
