import { Col, Row, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI } from '@/utils/timeSheet';
import styles from './index.less';

const WeeklyTable = (props) => {
  const {
    selectedDate = '',
    loadingFetchMyTimesheet = false,
    data: mockData = [], // mock
  } = props;

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

  useEffect(() => {
    refreshData();
  }, [JSON.stringify(mockData)]);

  // RENDER UI

  const _renderTableContent = () => {
    if (loading)
      return (
        <div className={styles.loadingContainer}>
          <Spin size="default" />
        </div>
      );

    return null;
  };

  // MAIN AREA
  return (
    <div className={styles.WeeklyTable}>
      <div className={styles.tableContainer}>{_renderTableContent()}</div>
    </div>
  );
};

export default connect(({ loading, timeSheet: { myTimesheet = [] } = {} }) => ({
  myTimesheet,
  loadingFetchMyTimesheet: loading.effects['timeSheet/fetchMyTimesheetEffect'],
}))(WeeklyTable);
