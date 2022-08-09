import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI, VIEW_TYPE } from '@/constants/timeSheet';
import ViewTypeSelector from '@/pages/TimeSheet/components/ComplexView/components/ViewTypeSelector';
import { getCurrentCompany } from '@/utils/authority';
import useCancelToken from '@/utils/hooks';
import { generateAllWeeks } from '@/utils/timeSheet';
import { debounceFetchData } from '@/utils/utils';
import DailyFooter from './components/DailyFooter';
import DailyHeader from './components/DailyHeader';
import DailyTable from './components/DailyTable';
import MonthlyHeader from './components/MonthlyHeader';
import MonthlyTable from './components/MonthlyTable';
import WeeklyHeader from './components/WeeklyHeader';
import WeeklyTable from './components/WeeklyTable';
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
  const { cancelToken, cancelRequest } = useCancelToken();

  const {
    dispatch,
    myTimesheetByDay = [],
    myTimesheetByWeek = [],
    myTimesheetByMonth = [],
    timeoffList = [],
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
        cancelToken: cancelToken(),
      },
    });
  };

  const fetchMyProjectList = () => {
    dispatch({
      type: 'timeSheet/fetchMyProjects',
      payload: {
        employee: employeeId,
      },
    });
  };

  // USE EFFECT AREA
  useLayoutEffect(() => {
    if (selectedDate && selectedView === VIEW_TYPE.D) {
      debounceFetchData(() => fetchMyTimesheetEffectByType(selectedDate, selectedDate));
      return () => {
        cancelRequest();
      };
    }
    return () => {};
  }, [selectedDate, selectedView]);

  useLayoutEffect(() => {
    if (startDateWeek && selectedView === VIEW_TYPE.W) {
      debounceFetchData(() => fetchMyTimesheetEffectByType(startDateWeek, endDateWeek));
      return () => {
        cancelRequest();
      };
    }
    return () => {};
  }, [startDateWeek, selectedView]);

  useLayoutEffect(() => {
    if (startDateMonth && selectedView === VIEW_TYPE.M) {
      debounceFetchData(() => fetchMyTimesheetEffectByType(startDateMonth, endDateMonth));
      return () => {
        cancelRequest();
      };
    }
    return () => {};
  }, [startDateMonth, selectedView]);

  useEffect(() => {
    if (moment(currentDateProp).isValid() === true) {
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

  useEffect(() => {
    fetchMyProjectList();
  }, []);

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
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
          />
        );

      case VIEW_TYPE.M:
        return (
          <MonthlyHeader
            startDate={startDateMonth}
            selectedDate={selectedDate}
            endDate={endDateMonth}
            setStartDate={setStartDateMonth}
            setEndDate={setEndDateMonth}
            viewChangeComponent={viewChangeComponent}
            setSelectedDate={setSelectedDate}
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
          <WeeklyTable
            startDate={startDateWeek}
            endDate={endDateWeek}
            data={myTimesheetByWeek}
            timeoffList={timeoffList}
            setSelectedDate={setSelectedDate}
            setSelectedView={setSelectedView}
          />
        );
      case VIEW_TYPE.M:
        return (
          <MonthlyTable
            startDate={startDateMonth}
            endDate={endDateMonth}
            weeksOfMonth={weeksOfMonth}
            data={myTimesheetByMonth}
            timeoffList={timeoffList}
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
    timeSheet: {
      myTimesheetByDay = [],
      myTimesheetByWeek = [],
      myTimesheetByMonth = [],
      timeoffList = [],
    } = {},
    user: { currentUser: { employee = {} } = {} },
    loading,
  }) => ({
    employee,
    myTimesheetByDay,
    myTimesheetByWeek,
    myTimesheetByMonth,
    timeoffList,
    loadingFetch: loading.effects['timeSheet/fetchMyTimesheetByTypeEffect'],
  }),
)(MyTimeSheet);
