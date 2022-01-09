import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { generateAllWeeks, dateFormatAPI, VIEW_TYPE } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import ViewTypeSelector from '@/pages/TimeSheet/components/ComplexView/components/ViewTypeSelector';
import DailyHeader from './components/DailyHeader';
import WeeklyHeader from './components/WeeklyHeader';
import MonthlyHeader from './components/MonthlyHeader';
import DailyTable from './components/DailyTable';
import WeeklyTable from './components/WeeklyTable';
import MonthlyTable from './components/MonthlyTable';
import DailyFooter from './components/DailyFooter';

import styles from './index.less';

const MyTimeSheet = (props) => {
  // daily
  const [selectedDate, setSelectedDate] = useState(moment());

  // weekly
  const [startDateWeek, setStartDateWeek] = useState('');
  const [endDateWeek, setEndDateWeek] = useState('');

  // monthly
  const [startDateMonth, setStartDateMonth] = useState('');
  const [endDateMonth, setEndDateMonth] = useState('');
  const [weeksOfMonth, setWeeksOfMonth] = useState([]);

  // others
  const [selectedView, setSelectedView] = useState(VIEW_TYPE.D); // D: daily, W: weekly, M: monthly
  const {
    dispatch,
    myTimesheetByDay = [],
    myTimesheetByWeek = [],
    myTimesheetByMonth = [],
    employee: { _id: employeeId = '' } = {},
    currentDateProp = '',
  } = props;

  // FUNCTION AREA
  const fetchMyTimesheetEffectByType = (startDate, endDate) => {
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
      fetchMyTimesheetEffectByType(selectedDate, selectedDate);
    }
  }, [selectedDate, selectedView]);

  useEffect(() => {
    if (startDateWeek && selectedView === VIEW_TYPE.W) {
      fetchMyTimesheetEffectByType(startDateWeek, endDateWeek);
    }
  }, [startDateWeek, selectedView]);

  useEffect(() => {
    if (startDateMonth && selectedView === VIEW_TYPE.M) {
      fetchMyTimesheetEffectByType(startDateMonth, endDateMonth);
    }
  }, [startDateMonth, selectedView]);

  useEffect(() => {
    if (moment(currentDateProp).isValid() ===  true) {
      setSelectedDate(moment(currentDateProp));
    }
  }, [currentDateProp]);

  // generate dates for week
  useEffect(() => {
    const lastSunday = moment().weekday(1);
    const currentSunday = moment().weekday(7);
    setStartDateWeek(lastSunday);
    setEndDateWeek(currentSunday);
  }, []);

  // get current month
  useEffect(() => {
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    setStartDateMonth(startOfMonth);
    setEndDateMonth(endOfMonth);
  }, []);

  // refresh the week list when the month changed
  useEffect(() => {
    const weeks = generateAllWeeks(startDateMonth, endDateMonth);
    setWeeksOfMonth(weeks);
  }, [startDateMonth]);

  // RENDER UI
  const viewChangeComponent = () => (
    <ViewTypeSelector selectedView={selectedView} setSelectedView={setSelectedView} />
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
        return (
          <WeeklyHeader
            startDate={startDateWeek}
            endDate={endDateWeek}
            setStartDate={setStartDateWeek}
            setEndDate={setEndDateWeek}
            viewChangeComponent={viewChangeComponent}
          />
        );

      case VIEW_TYPE.M:
        return (
          <MonthlyHeader
            startDate={startDateMonth}
            endDate={endDateMonth}
            setStartDate={setStartDateMonth}
            setEndDate={setEndDateMonth}
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
        return (
          <WeeklyTable startDate={startDateWeek} endDate={endDateWeek} data={myTimesheetByWeek} />
        );
      case VIEW_TYPE.M:
        return (
          <MonthlyTable
            startDate={startDateMonth}
            endDate={endDateMonth}
            weeksOfMonth={weeksOfMonth}
            data={myTimesheetByMonth}
          />
        );
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
