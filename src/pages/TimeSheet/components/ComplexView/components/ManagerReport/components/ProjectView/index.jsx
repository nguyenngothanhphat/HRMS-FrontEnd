import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ViewTypeSelector from '@/pages/TimeSheet/components/ComplexView/components/ViewTypeSelector';
import { getCurrentCompany } from '@/utils/authority';
import { dateFormatAPI, VIEW_TYPE } from '@/utils/timeSheet';
import Header from './components/Header';
import MonthlyTable from './components/MonthlyTable';
import WeeklyTable from './components/WeeklyTable';
import styles from './index.less';

const ProjectView = (props) => {
  // weekly
  const [startDateWeek, setStartDateWeek] = useState('');
  const [endDateWeek, setEndDateWeek] = useState('');

  // monthly
  const [startDateMonth, setStartDateMonth] = useState('');
  const [endDateMonth, setEndDateMonth] = useState('');
  const [weeksOfMonth, setWeeksOfMonth] = useState([]);

  // others
  const [selectedView, setSelectedView] = useState(VIEW_TYPE.W); // D: daily, W: weekly, M: monthly

  const [currentProject, setCurrentProject] = useState(1);

  const {
    dispatch,
    myTimesheetByWeek = [],
    myTimesheetByMonth = [],
    employee: { _id: employeeId = '' } = {},
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
    if (startDateWeek && selectedView === VIEW_TYPE.W) {
      fetchMyTimesheetEffectByType(startDateWeek, endDateWeek);
    }
  }, [startDateWeek, selectedView]);

  useEffect(() => {
    if (startDateMonth && selectedView === VIEW_TYPE.M) {
      fetchMyTimesheetEffectByType(startDateMonth, endDateMonth);
    }
  }, [startDateMonth, selectedView]);

  // generate dates for week
  useEffect(() => {
    const lastSunday = moment().weekday(1);
    const currentSunday = moment().weekday(7);
    setStartDateWeek(lastSunday);
    setEndDateWeek(currentSunday);
  }, []);

  // generate weeks for month
  const generateAllWeeks = (fromDate, toDate) => {
    const weeks = [];
    let fd = new Date(fromDate);
    const weekNo = moment(fromDate, 'YYYY-MM-DD').week();
    const td = new Date(toDate);
    while (fd.getTime() < td.getTime()) {
      // const weekNumber = getWeekInMonth(fd)
      const weekNumber = moment(fd).week() - weekNo + 1;
      const startWeek = moment(fd).startOf('week').toDate();
      const endWeek = moment(fd).endOf('week').toDate();
      const existed = weeks.find((x) => x.week === weekNumber);
      fd = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() + 1);
      if (!existed) {
        weeks.push({
          week: weekNumber,
          startDate: moment(startWeek).format('YYYY-MM-DD'),
          endDate: moment(endWeek).format('YYYY-MM-DD'),
        });
      }
    }
    return weeks;
  };

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
    <ViewTypeSelector
      showDay={false}
      selectedView={selectedView}
      setSelectedView={setSelectedView}
    />
  );

  const renderHeader = () => {
    switch (selectedView) {
      case VIEW_TYPE.W:
        return (
          <Header
            startDate={startDateWeek}
            endDate={endDateWeek}
            setStartDate={setStartDateWeek}
            setEndDate={setEndDateWeek}
            viewChangeComponent={viewChangeComponent}
            type={VIEW_TYPE.W}
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
          />
        );

      case VIEW_TYPE.M:
        return (
          <Header
            startDate={startDateMonth}
            endDate={endDateMonth}
            setStartDate={setStartDateMonth}
            setEndDate={setEndDateMonth}
            viewChangeComponent={viewChangeComponent}
            type={VIEW_TYPE.M}
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
          />
        );

      default:
        return null;
    }
  };

  const renderTable = () => {
    switch (selectedView) {
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
    <div className={styles.ProjectView}>
      {renderHeader()}
      {renderTable()}
      {renderFooter()}
    </div>
  );
};

export default connect(
  ({
    timeSheet: { myTimesheetByWeek = [], myTimesheetByMonth = [] } = {},
    user: { currentUser: { employee = {} } = {} },
  }) => ({
    employee,
    myTimesheetByWeek,
    myTimesheetByMonth,
  }),
)(ProjectView);
