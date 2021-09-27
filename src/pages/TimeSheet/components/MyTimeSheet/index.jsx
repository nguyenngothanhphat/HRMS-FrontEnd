import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import Header from './components/Header';
import TimelineTable from './components/TimelineTable';
import styles from './index.less';

const MyTimeSheet = () => {
  const [firstDateOfWeek, setFirstDateOfWeek] = useState('');
  const [endDateOfWeek, setEndDateOfWeek] = useState('');

  // USE EFFECT AREA
  useEffect(() => {
    const lastSunday = moment().weekday(0);
    const currentSunday = moment().weekday(7);
    setFirstDateOfWeek(lastSunday);
    setEndDateOfWeek(currentSunday);
    return () => {};
  }, []);

  // MAIN AREA
  return (
    <div className={styles.MyTimeSheet}>
      <Header
        firstDateOfWeek={firstDateOfWeek}
        endDateOfWeek={endDateOfWeek}
        setFirstDateOfWeek={setFirstDateOfWeek}
        setEndDateOfWeek={setEndDateOfWeek}
      />
      <TimelineTable firstDateOfWeek={firstDateOfWeek} endDateOfWeek={endDateOfWeek} />
    </div>
  );
};

export default connect(() => ({}))(MyTimeSheet);
