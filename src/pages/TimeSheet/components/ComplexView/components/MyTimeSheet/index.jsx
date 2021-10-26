import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany } from '@/utils/authority';
import Header from './components/Header';
import DailyTable from './components/DailyTable';
import WeeklyTable from './components/WeeklyTable';
import DailyFooter from './components/DailyFooter';
import styles from './index.less';
import { dateFormatAPI } from '@/utils/timeSheet';

const mockData = [
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
];

const MyTimeSheet = (props) => {
  const [selectedDate, setSelectedDate] = useState(moment());
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

  // RENDER UI
  const renderTable = () => {
    switch (selectedView) {
      case 'daily':
        return <DailyTable selectedDate={selectedDate} data={mockData} />;
      case 'weekly':
        return <WeeklyTable selectedDate={selectedDate} data={mockData} />;
      case 'monthly':
        return null;
      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (selectedView) {
      case 'daily':
        return <DailyFooter data={mockData} />;
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
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />
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
