import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany } from '@/utils/authority';
import ViewChange from './components/ViewChange';
import DailyHeader from './components/DailyHeader';
import WeeklyHeader from './components/WeeklyHeader';
import DailyTable from './components/DailyTable';
import WeeklyTable from './components/WeeklyTable';
import DailyFooter from './components/DailyFooter';
// import WeeklyFooter from './components/WeeklyFooter';

import styles from './index.less';
import { dateFormatAPI, VIEW_TYPE } from '@/utils/timeSheet';

const MyTimeSheet = (props) => {
  // daily
  const [selectedDate, setSelectedDate] = useState(moment());

  // weekly
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // others
  const [selectedView, setSelectedView] = useState(VIEW_TYPE.W); // D: daily, W: weekly, M: monthly
  const {
    dispatch,
    myTimesheetByDay = [],
    myTimesheetByWeek = [],
    employee: { _id: employeeId = '' } = {},
  } = props;

  // FUNCTION AREA
  const fetchMyTimesheetEffectByDate = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        fromDate: moment(selectedDate).format(dateFormatAPI),
        toDate: moment(selectedDate).format(dateFormatAPI),
        viewType: selectedView,
      },
    });
  };

  const fetchMyTimesheetEffectByWeek = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
        viewType: selectedView,
      },
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (selectedDate && selectedView === VIEW_TYPE.D) {
      fetchMyTimesheetEffectByDate();
    }
  }, [selectedDate, selectedView]);

  useEffect(() => {
    if (startDate && selectedView === VIEW_TYPE.W) {
      fetchMyTimesheetEffectByWeek();
    }
  }, [startDate, selectedView]);

  useEffect(() => {
    const lastSunday = moment().weekday(1);
    const currentSunday = moment().weekday(7);
    setStartDate(lastSunday);
    setEndDate(currentSunday);
    return () => {};
  }, []);

  // RENDER UI
  const viewChangeComponent = () => (
    <ViewChange selectedView={selectedView} setSelectedView={setSelectedView} />
  );

  const renderHeader = () => {
    switch (selectedView) {
      case VIEW_TYPE.D:
        return (
          <DailyHeader
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            viewChangeComponent={viewChangeComponent}
          />
        );
      case VIEW_TYPE.W:
      case VIEW_TYPE.M:
        return (
          <WeeklyHeader
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            viewChangeComponent={viewChangeComponent}
          />
        );

      default:
        return null;
    }
  };

  const renderTable = () => {
    switch (selectedView) {
      case VIEW_TYPE.D:
        return <DailyTable selectedDate={selectedDate} data={myTimesheetByDay} />;
      case VIEW_TYPE.W:
        return <WeeklyTable startDate={startDate} endDate={endDate} data={myTimesheetByWeek} />;
      case VIEW_TYPE.M:
        return null;
      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (selectedView) {
      case VIEW_TYPE.D:
        return <DailyFooter data={myTimesheetByDay} />;
      case VIEW_TYPE.W:
        return null;
      case VIEW_TYPE.M:
        return null;
      default:
        return null;
    }
  };

  // MAIN AREA
  return (
    <div className={styles.MyTimeSheet}>
      {renderHeader()}
      {renderTable()}
      {renderFooter()}
    </div>
  );
};

export default connect(
  ({
    timeSheet: { myTimesheetByDay = [], myTimesheetByWeek = [], myTimesheetByMonth = [] } = {},
    user: { currentUser: { employee = {} } = {} },
  }) => ({
    employee,
    myTimesheetByDay,
    myTimesheetByWeek,
    myTimesheetByMonth,
  }),
)(MyTimeSheet);
