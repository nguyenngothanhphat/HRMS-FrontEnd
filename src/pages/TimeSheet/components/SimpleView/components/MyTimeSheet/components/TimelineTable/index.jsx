import { Col, Row, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { MT_MAIN_COL_SPAN, MT_SECONDARY_COL_SPAN } from '@/constants/timeSheet';
import ActivityList from './components/ActivityList';
import styles from './index.less';

const { DATE, REMAINING } = MT_MAIN_COL_SPAN;
const { ACTIVITY, START_TIME, END_TIME, NIGHT_SHIFT, TOTAL_HOURS, NOTES, ACTIONS } =
  MT_SECONDARY_COL_SPAN;

const TimelineTable = (props) => {
  const { startDate = '', endDate = '', myTimesheet = [], loadingFetchMyTimesheet = false } = props;
  const [dateList, setDateList] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const loading = loadingFetchMyTimesheet;

  // get dates between two dates
  const enumerateDaysBetweenDates = (startDate1, endDate1) => {
    const now = startDate1.clone();
    const dates = [];

    while (now.isSameOrBefore(endDate1)) {
      dates.push(now.format('MM/DD/YYYY'));
      now.add(1, 'days');
    }
    return dates;
  };

  // generate data by selected date
  const generateData = (data) => {
    const dataTemp = data.map((item) => {
      return {
        ...item,
        date: moment(item.date).format('MM/DD/YYYY'),
      };
    });

    return dateList.map((date) => {
      const find = dataTemp.find((item) => item.date === date);
      return {
        ...find,
        date,
        timesheet: find?.timesheet || [],
      };
    });
  };

  const refreshData = () => {
    const formattedDataTemp = generateData(myTimesheet);
    setFormattedData(formattedDataTemp);
  };

  // USE EFFECT AREA
  useEffect(() => {
    const dateListTemp = enumerateDaysBetweenDates(moment(startDate), moment(endDate));
    setDateList(dateListTemp);
  }, [startDate, endDate]);

  useEffect(() => {
    refreshData();
  }, [JSON.stringify(myTimesheet)]);

  useEffect(() => {
    refreshData();
  }, [dateList]);

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
        <Col span={DATE} className={`${styles.tableHeader__firstColumn} ${styles.alignCenter}`}>
          Day
        </Col>
        <Col span={REMAINING}>
          <div className={styles.tableHeader__remainColumn}>
            <Row gutter={[12, 0]}>
              <Col span={ACTIVITY} className={styles.title}>
                Activity
              </Col>
              <Col span={START_TIME} className={styles.title}>
                Time In
              </Col>
              <Col span={END_TIME} className={styles.title}>
                Time Out
              </Col>
              <Col span={NIGHT_SHIFT} className={styles.title}>
                Nightshift
              </Col>
              <Col span={TOTAL_HOURS} className={styles.title}>
                Total Hrs
              </Col>
              <Col span={NOTES} className={styles.title}>
                Notes
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
    return formattedData.map((item, index) => <ActivityList item={item} activityIndex={index} />);
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
