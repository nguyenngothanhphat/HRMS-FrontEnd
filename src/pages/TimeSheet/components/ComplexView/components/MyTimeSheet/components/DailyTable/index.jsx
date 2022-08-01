import { Col, Row, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import {
  dateFormatAPI,
  EMP_MT_MAIN_COL_SPAN,
  EMP_MT_SECONDARY_COL_SPAN,
  hourFormatAPI,
  WORKING_HOURS,
  DEFAULT_TOP_HOUR,
} from '@/utils/timeSheet';
import ActivityList from './components/ActivityList';
import styles from './index.less';

const { DATE_OF_HOURS, REMAINING } = EMP_MT_MAIN_COL_SPAN;
const { PROJECT, TASK, DESCRIPTION, TIME, TOTAL_HOURS, ACTIONS } = EMP_MT_SECONDARY_COL_SPAN;

const DailyTable = (props) => {
  const {
    selectedDate = '',
    loadingFetchMyTimesheetByType = false,
    data: dataProp = [],
    loadingFetchEmployeeSchedule = false,
    employeeSchedule = {},
  } = props;

  const { startWorkDay: { start: companyStartTime = '' } = {} } = employeeSchedule;

  const [hourList, setHourList] = useState([]);
  const [formattedData, setFormattedData] = useState({});
  const [startWorkingHour, setStartWorkingHour] = useState(null);
  const [endWorkingHour, setEndWorkingHour] = useState(null);

  const getFirstHour = (timesheet = []) => {
    // sort to get the first hour
    const sortedArr = JSON.parse(JSON.stringify(timesheet));
    sortedArr.sort(
      (a, b) =>
        moment(a.startTime, hourFormatAPI).hours() - moment(b.startTime, hourFormatAPI).hours(),
    );
    const firstItem = sortedArr.length > 0 ? sortedArr[0] : null;

    if (firstItem) {
      const val = moment(firstItem.startTime, hourFormatAPI).hours();
      return val > DEFAULT_TOP_HOUR ? DEFAULT_TOP_HOUR : val;
    }
    if (companyStartTime) {
      return moment(companyStartTime, hourFormatAPI).hours();
    }
    return 8;
  };

  // generate data by selected date
  const generateData = (data) => {
    return (
      data.find(
        (item) =>
          moment(item.date, dateFormatAPI).format('MM/DD/YYYY') ===
          moment(selectedDate).format('MM/DD/YYYY'),
      ) || {}
    );
  };

  const refreshData = () => {
    const formattedDataTemp = generateData(dataProp);
    setFormattedData(formattedDataTemp);
  };

  // USE EFFECT AREA
  useEffect(() => {
    const hourListTemp = [];
    for (let i = startWorkingHour; i <= endWorkingHour; i += 1) {
      hourListTemp.push(i);
    }
    setHourList(hourListTemp);
  }, [startWorkingHour]);

  useEffect(() => {
    refreshData();
  }, [JSON.stringify(dataProp), selectedDate]);

  useEffect(() => {
    const startWorkingHourTemp = getFirstHour(formattedData?.timesheet || []);
    setStartWorkingHour(startWorkingHourTemp);
    setEndWorkingHour(WORKING_HOURS.END);
  }, [JSON.stringify(formattedData)]);

  // RENDER UI
  const _renderTableHeader = () => {
    return (
      <Row className={styles.tableHeader}>
        <Col
          span={DATE_OF_HOURS}
          className={`${styles.tableHeader__firstColumn} ${styles.alignCenter}`}
        >
          Day of hours
        </Col>
        <Col span={REMAINING}>
          <div className={styles.tableHeader__remainColumn}>
            <Row gutter={[12, 12]}>
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
    return (
      <ActivityList
        data={formattedData}
        hourList={hourList}
        startWorkingHour={startWorkingHour}
        endWorkingHour={endWorkingHour}
      />
    );
  };

  // MAIN AREA
  return (
    <div className={styles.DailyTable}>
      <div className={styles.tableContainer}>
        <Spin spinning={loadingFetchMyTimesheetByType || loadingFetchEmployeeSchedule}>
          {_renderTableHeader()}
          {_renderTableContent()}
        </Spin>
      </div>
    </div>
  );
};

export default connect(
  ({ loading, timeSheet: { myTimesheet = [], employeeSchedule = {} } = {} }) => ({
    myTimesheet,
    employeeSchedule,
    loadingFetchMyTimesheetByType: loading.effects['timeSheet/fetchMyTimesheetByTypeEffect'],
    loadingFetchEmployeeSchedule: loading.effects['timeSheet/getEmployeeScheduleByLocation'],
  }),
)(DailyTable);
