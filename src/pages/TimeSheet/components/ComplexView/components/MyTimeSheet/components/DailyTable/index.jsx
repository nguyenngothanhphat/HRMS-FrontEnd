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

const DailyTable = (props) => {
  const {
    selectedDate = '',
    loadingFetchMyTimesheetByType = false,
    data: mockData = [], // mock
  } = props;

  const [hourList, setHourList] = useState([]);
  const [formattedData, setFormattedData] = useState({});

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
    const formattedDataTemp = generateData(mockData);
    setFormattedData(formattedDataTemp);
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (hourList.length === 0) {
      const hourListTemp = [];
      // from 6 AM to 11 PM
      for (let i = WORKING_HOURS.START; i <= WORKING_HOURS.END; i += 1) {
        hourListTemp.push(i);
      }
      setHourList(hourListTemp);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [JSON.stringify(mockData), selectedDate]);

  // RENDER UI
  const _renderTableHeader = () => {
    return (
      <Row
        className={styles.tableHeader}
        style={
          loadingFetchMyTimesheetByType
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
    if (loadingFetchMyTimesheetByType)
      return (
        <div className={styles.loadingContainer}>
          <Spin size="default" />
        </div>
      );

    return <ActivityList data={formattedData} hourList={hourList} />;
  };

  // MAIN AREA
  return (
    <div className={styles.DailyTable}>
      <div className={styles.tableContainer}>
        {_renderTableHeader()}
        {_renderTableContent()}
      </div>
    </div>
  );
};

export default connect(({ loading, timeSheet: { myTimesheet = [] } = {} }) => ({
  myTimesheet,
  loadingFetchMyTimesheetByType: loading.effects['timeSheet/fetchMyTimesheetByTypeEffect'],
}))(DailyTable);
