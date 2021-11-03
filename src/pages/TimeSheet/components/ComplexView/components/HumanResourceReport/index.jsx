import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI, VIEW_TYPE } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import Header from './components/Header';
import ViewChange from './components/ViewChange';
import WeeklyTable from './components/WeeklyTable';
import styles from './index.less';

const mockData = [
  {
    id: 1,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
  {
    id: 2,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
  {
    id: 3,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
  {
    id: 4,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
  {
    id: 5,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
  {
    id: 6,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
  {
    id: 7,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
  {
    id: 8,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
  {
    id: 9,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
  {
    id: 10,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
  {
    id: 11,
    user: { name: 'Bessie Cooper', employeeId: 'PSI - 2244' },
    department: 'UX Mumbai',
    project: 'Udaan Retainer',
    workingDays: '5/5 (40 hours)',
    leavesTaken: '0/3',
    totalHours: '160 hours',
  },
];
const HumanResourceReport = (props) => {
  // weekly
  const [startDateWeek, setStartDateWeek] = useState('');
  const [endDateWeek, setEndDateWeek] = useState('');

  // monthly
  const [startDateMonth, setStartDateMonth] = useState('');
  const [endDateMonth, setEndDateMonth] = useState('');
  const [weeksOfMonth, setWeeksOfMonth] = useState([]);

  // others
  const [selectedView, setSelectedView] = useState(VIEW_TYPE.W); // D: daily, W: weekly, M: monthly
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
    <ViewChange selectedView={selectedView} setSelectedView={setSelectedView} />
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
          />
        );

      default:
        return null;
    }
  };

  const renderTable = () => {
    switch (selectedView) {
      case VIEW_TYPE.W:
        return <WeeklyTable startDate={startDateWeek} endDate={endDateWeek} data={mockData} />;
      case VIEW_TYPE.M:
        return (
          <WeeklyTable
            startDate={startDateMonth}
            endDate={endDateMonth}
            weeksOfMonth={weeksOfMonth}
            data={mockData}
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
    <div className={styles.HumanResourceReport}>
      {renderHeader()}
      {renderTable()}
      {renderFooter()}
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
}))(HumanResourceReport);
