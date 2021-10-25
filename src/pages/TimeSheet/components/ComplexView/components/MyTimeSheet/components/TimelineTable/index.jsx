import { Col, Row, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import {
  dateFormatAPI,
  EMP_MT_MAIN_COL_SPAN,
  EMP_MT_SECONDARY_COL_SPAN,
  WORKING_HOURS,
} from '@/utils/timeSheet';
import ActivityList from './components/ActivityList';
import styles from './index.less';

const { DATE_OF_HOURS, REMAINING } = EMP_MT_MAIN_COL_SPAN;
const { PROJECT, TASK, DESCRIPTION, TIME, TOTAL_HOURS, ACTIONS } = EMP_MT_SECONDARY_COL_SPAN;

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
    date: '2021-10-25',
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

const TimelineTable = (props) => {
  const { selectedDate = '', loadingFetchMyTimesheet = false } = props;
  const [hourList, setHourList] = useState([]);
  const [formattedData, setFormattedData] = useState({});
  const loading = loadingFetchMyTimesheet;

  // generate data by selected date
  const generateData = (data) => {
    const result =
      data.find(
        (item) =>
          moment(item.date, dateFormatAPI).format('MM/DD/YYYY') ===
          moment(selectedDate).format('MM/DD/YYYY'),
      ) || {};
    return result;
  };

  const refreshData = () => {
    const formattedDataTemp = generateData(mockData);
    setFormattedData(formattedDataTemp);
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (hourList.length === 0) {
      const hourListTemp = [];
      // from 8 AM to 9 PM
      for (let i = WORKING_HOURS.START; i <= WORKING_HOURS.END; i += 1) {
        hourListTemp.push(i);
      }
      setHourList(hourListTemp);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [JSON.stringify(mockData)]);

  // RENDER UI
  const _renderTableHeader = () => {
    return (
      <Row
        className={styles.tableHeader}
        style={
          loading
            ? { opacity: 0.7, transition: 'ease-in-out 1.5s' }
            : { opacity: 1, transition: 'ease-in-out 1.5s' }
        }
      >
        <Col
          span={DATE_OF_HOURS}
          className={`${styles.tableHeader__firstColumn} ${styles.alignCenter}`}
        >
          Day of hours
        </Col>
        <Col span={REMAINING}>
          <div className={styles.tableHeader__remainColumn}>
            <Row gutter={[12, 0]}>
              <Col span={PROJECT} className={styles.title}>
                Project
              </Col>
              <Col span={TASK} className={styles.title}>
                Task
              </Col>
              <Col span={DESCRIPTION} className={styles.title}>
                Description
              </Col>
              <Col span={TIME} className={styles.title}>
                Time
              </Col>
              <Col span={TOTAL_HOURS} className={styles.title}>
                Total Hrs
              </Col>
              <Col span={ACTIONS} className={`${styles.title} ${styles.alignCenter}`}>
                Action
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  };

  const _renderTableContent = () => {
    if (loading)
      return (
        <div className={styles.loadingContainer}>
          <Spin size="default" />
        </div>
      );

    return <ActivityList data={formattedData} hourList={hourList} />;
  };

  // MAIN AREA
  return (
    <div className={styles.TimelineTable}>
      <div className={styles.tableContainer}>
        {_renderTableHeader()}
        {_renderTableContent()}
      </div>
    </div>
  );
};

export default connect(({ loading, timeSheet: { myTimesheet = [] } = {} }) => ({
  myTimesheet,
  loadingFetchMyTimesheet: loading.effects['timeSheet/fetchMyTimesheetEffect'],
}))(TimelineTable);
