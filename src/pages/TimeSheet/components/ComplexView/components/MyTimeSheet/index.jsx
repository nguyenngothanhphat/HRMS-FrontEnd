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
import WeeklyFooter from './components/WeeklyFooter';

import styles from './index.less';
import { dateFormatAPI } from '@/utils/timeSheet';

const mockDataDaily = [
  {
    id: 17,
    companyId: '6153e2ebb51335302899a366',
    employeeId: '61765b19b9b27400abf50719',
    managerId: '61765abcb9b27400abf50710',
    manager: {
      workEmail: 'lewis-manager@mailinator.com',
      department: {
        id: '6153e2ecb51335302899a375',
        name: 'Engineering',
      },
      employeeId: '61765abcb9b27400abf50710',
      employeeCode: 'lewis-manager',
      employeeName: 'Lewis Manager',
    },
    employee: {
      workEmail: 'lewis-employee@mailinator.com',
      department: {
        id: '6153e2ecb51335302899a375',
        name: 'Engineering',
      },
      employeeCode: 'lewis-employee',
      employeeName: 'Lewis Employee',
    },
    department: {},
    date: '2021-10-27',
    location: '',
    createdAt: '2021-10-25T07:30:55.000Z',
    updatedAt: '2021-10-25T07:30:55.000Z',
    deletedAt: 0,
    status: 'SUBMITTED',
    approverInfo: null,
    approvedOn: null,
    totalLeaveTime: 0,
    totalOTTime: 3600000,
    totalWorkingTime: 32400000,
    totalHours: '09:00:00.0000',
    timesheet: [
      {
        id: 30,
        taskName: 'Working hours',
        dailyId: 17,
        projectName: 'HRMS',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '08:30',
        nightShift: false,
        endTime: '12:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 14400000,
        notes: 'Working on HRMS',
        totalHours: '04:00:00.0000',
      },
      {
        id: 31,
        taskName: 'Lunch Break',
        dailyId: 17,
        projectName: 'HRMS',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '12:00',
        nightShift: false,
        endTime: '13:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 3600000,
        notes: 'Lunch Break',
        totalHours: '01:00:00.0000',
      },
      {
        id: 32,
        taskName: 'Working hours',
        dailyId: 17,
        projectName: 'HRMS',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '13:30',
        nightShift: false,
        endTime: '17:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 14400000,
        notes: 'Working on Intranet',
        totalHours: '04:00:00.0000',
      },
      {
        id: 32,
        taskName: 'Working hours',
        dailyId: 17,
        projectName: 'Intranet',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '17:30',
        nightShift: false,
        endTime: '20:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 14400000,
        notes: 'Working on Intranet',
        totalHours: '04:00:00.0000',
      },
    ],
  },
  {
    id: 17,
    companyId: '6153e2ebb51335302899a366',
    employeeId: '61765b19b9b27400abf50719',
    managerId: '61765abcb9b27400abf50710',
    manager: {
      workEmail: 'lewis-manager@mailinator.com',
      department: {
        id: '6153e2ecb51335302899a375',
        name: 'Engineering',
      },
      employeeId: '61765abcb9b27400abf50710',
      employeeCode: 'lewis-manager',
      employeeName: 'Lewis Manager',
    },
    employee: {
      workEmail: 'lewis-employee@mailinator.com',
      department: {
        id: '6153e2ecb51335302899a375',
        name: 'Engineering',
      },
      employeeCode: 'lewis-employee',
      employeeName: 'Lewis Employee',
    },
    department: {},
    date: '2021-10-28',
    location: '',
    createdAt: '2021-10-25T07:30:55.000Z',
    updatedAt: '2021-10-25T07:30:55.000Z',
    deletedAt: 0,
    status: 'SUBMITTED',
    approverInfo: null,
    approvedOn: null,
    totalLeaveTime: 0,
    totalOTTime: 3600000,
    totalWorkingTime: 32400000,
    totalHours: '09:00:00.0000',
    timesheet: [
      {
        id: 30,
        taskName: 'Working hours',
        dailyId: 17,
        projectName: 'HRMS',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '08:30',
        nightShift: false,
        endTime: '12:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 14400000,
        notes: 'Working on HRMS',
        totalHours: '04:00:00.0000',
      },
      {
        id: 31,
        taskName: 'Lunch Break',
        dailyId: 17,
        projectName: 'HRMS',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '12:00',
        nightShift: false,
        endTime: '13:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 3600000,
        notes: 'Lunch Break',
        totalHours: '01:00:00.0000',
      },
      {
        id: 32,
        taskName: 'Working hours',
        dailyId: 17,
        projectName: 'Intranet',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '17:30',
        nightShift: false,
        endTime: '20:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 14400000,
        notes: 'Working on Intranet',
        totalHours: '04:00:00.0000',
      },
    ],
  },
];

const mockDataWeekly = [
  {
    id: 17,
    companyId: '6153e2ebb51335302899a366',
    employeeId: '61765b19b9b27400abf50719',
    managerId: '61765abcb9b27400abf50710',
    manager: {
      workEmail: 'lewis-manager@mailinator.com',
      department: {
        id: '6153e2ecb51335302899a375',
        name: 'Engineering',
      },
      employeeId: '61765abcb9b27400abf50710',
      employeeCode: 'lewis-manager',
      employeeName: 'Lewis Manager',
    },
    employee: {
      workEmail: 'lewis-employee@mailinator.com',
      department: {
        id: '6153e2ecb51335302899a375',
        name: 'Engineering',
      },
      employeeCode: 'lewis-employee',
      employeeName: 'Lewis Employee',
    },
    department: {},
    date: '2021-10-26',
    location: '',
    createdAt: '2021-10-25T07:30:55.000Z',
    updatedAt: '2021-10-25T07:30:55.000Z',
    deletedAt: 0,
    status: 'SUBMITTED',
    approverInfo: null,
    approvedOn: null,
    totalLeaveTime: 0,
    totalOTTime: 3600000,
    totalWorkingTime: 32400000,
    totalHours: '09:00:00.0000',
    timesheet: [
      {
        id: 30,
        taskName: 'Working hours',
        dailyId: 17,
        projectName: 'HRMS',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '08:30',
        nightShift: false,
        endTime: '12:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 14400000,
        notes: 'Working on HRMS',
        totalHours: '04:00:00.0000',
      },
      {
        id: 31,
        taskName: 'Lunch Break',
        dailyId: 17,
        projectName: 'HRMS',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '12:00',
        nightShift: false,
        endTime: '13:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 3600000,
        notes: 'Lunch Break',
        totalHours: '01:00:00.0000',
      },
      {
        id: 32,
        taskName: 'Working hours',
        dailyId: 17,
        projectName: 'HRMS',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '13:30',
        nightShift: false,
        endTime: '17:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 14400000,
        notes: 'Working on Intranet',
        totalHours: '04:00:00.0000',
      },
    ],
  },

  {
    id: 18,
    companyId: '6153e2ebb51335302899a366',
    employeeId: '61765b19b9b27400abf50719',
    managerId: '61765abcb9b27400abf50710',
    manager: {
      workEmail: 'lewis-manager@mailinator.com',
      department: {
        id: '6153e2ecb51335302899a375',
        name: 'Engineering',
      },
      employeeId: '61765abcb9b27400abf50710',
      employeeCode: 'lewis-manager',
      employeeName: 'Lewis Manager',
    },
    employee: {
      workEmail: 'lewis-employee@mailinator.com',
      department: {
        id: '6153e2ecb51335302899a375',
        name: 'Engineering',
      },
      employeeCode: 'lewis-employee',
      employeeName: 'Lewis Employee',
    },
    department: {},
    date: '2021-10-28',
    location: '',
    createdAt: '2021-10-25T07:30:55.000Z',
    updatedAt: '2021-10-25T07:30:55.000Z',
    deletedAt: 0,
    status: 'SUBMITTED',
    approverInfo: null,
    approvedOn: null,
    totalLeaveTime: 0,
    totalOTTime: 3600000,
    totalWorkingTime: 32400000,
    totalHours: '09:00:00.0000',
    timesheet: [
      {
        id: 30,
        taskName: 'Working hours',
        dailyId: 17,
        projectName: 'Syscloud',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '08:30',
        nightShift: false,
        endTime: '12:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 14400000,
        notes: 'Working on Syscloud',
        totalHours: '04:00:00.0000',
      },
      {
        id: 31,
        taskName: 'Lunch Break',
        dailyId: 17,
        projectName: 'Lifecell',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '12:00',
        nightShift: false,
        endTime: '13:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 3600000,
        notes: 'Lunch Break',
        totalHours: '01:00:00.0000',
      },
      {
        id: 31,
        taskName: 'Lunch Break',
        dailyId: 17,
        projectName: 'Udaan',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '12:00',
        nightShift: false,
        endTime: '13:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 3600000,
        notes: 'Lunch Break',
        totalHours: '01:00:00.0000',
      },
      {
        id: 31,
        taskName: 'Lunch Break',
        dailyId: 17,
        projectName: 'Ramco',
        employeeId: '61765b19b9b27400abf50719',
        startTime: '12:00',
        nightShift: false,
        endTime: '13:00',
        type: 'TASK',
        deletedAt: 0,
        duration: 3600000,
        notes: 'Lunch Break',
        totalHours: '01:00:00.0000',
      },
    ],
  },
];

const MyTimeSheet = (props) => {
  // daily
  const [selectedDate, setSelectedDate] = useState(moment());

  // weekly
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // others
  const [selectedView, setSelectedView] = useState('weekly');
  const { dispatch, employee: { _id: employeeId = '' } = {} } = props;

  // FUNCTION AREA
  const fetchMyTimesheetEffect = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        fromDate: moment(selectedDate).format(dateFormatAPI),
        toDate: moment(selectedDate).format(dateFormatAPI),
      },
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (selectedDate) {
      fetchMyTimesheetEffect();
    }
  }, [selectedDate]);

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
      case 'daily':
        return (
          <DailyHeader
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            viewChangeComponent={viewChangeComponent}
          />
        );
      case 'weekly':
      case 'monthly':
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
      case 'daily':
        return <DailyTable selectedDate={selectedDate} data={mockDataDaily} />;
      case 'weekly':
        return <WeeklyTable startDate={startDate} endDate={endDate} data={mockDataWeekly} />;
      case 'monthly':
        return null;
      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (selectedView) {
      case 'daily':
        return <DailyFooter data={mockDataDaily} />;
      case 'weekly':
        return null;
      case 'monthly':
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
  ({ timeSheet: { myTimesheet = [] } = {}, user: { currentUser: { employee = {} } = {} } }) => ({
    employee,
    myTimesheet,
  }),
)(MyTimeSheet);
