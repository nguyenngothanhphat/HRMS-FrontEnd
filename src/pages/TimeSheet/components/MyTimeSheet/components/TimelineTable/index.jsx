import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/timeSheet/add.svg';
import ActivityCard from './components/ActivityCard';
import styles from './index.less';

const dateFormat = 'ddd, MMM Do';

const TimelineTable = (props) => {
  const { startDate = '', endDate = '', myTimesheet = [] } = props;
  const [dateList, setDateList] = useState([]);
  const [formattedData, setFormattedData] = useState([]);

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
        day: moment(item.day).format('MM/DD/YYYY'),
      };
    });

    return dateList.map((date) => {
      return {
        date,
        activities: dataTemp.filter((item) => item.day === date),
      };
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    const dateListTemp = enumerateDaysBetweenDates(moment(startDate), moment(endDate));
    setDateList(dateListTemp);
  }, [startDate, endDate]);

  useEffect(() => {
    const formattedDataTemp = generateData(myTimesheet);
    setFormattedData(formattedDataTemp);
  }, [dateList]);

  // RENDER UI
  const _renderTableHeader = () => {
    return (
      <Row className={styles.tableHeader}>
        <Col span={3} className={`${styles.tableHeader__firstColumn} ${styles.alignCenter}`}>
          Date
        </Col>
        <Col span={21}>
          <Row className={styles.tableHeader__remainColumn}>
            <Col span={3} className={styles.title}>
              Activity
            </Col>
            <Col span={3} className={styles.title}>
              Time In
            </Col>
            <Col span={3} className={styles.title}>
              Time Out
            </Col>
            <Col span={3} className={styles.title}>
              Nightshift
            </Col>
            <Col span={3} className={styles.title}>
              Total Hrs
            </Col>
            <Col span={6} className={styles.title}>
              Notes
            </Col>
            <Col span={3} className={`${styles.title} ${styles.alignCenter}`}>
              Action
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const _renderAddButton = () => {
    return (
      <div className={styles.addButton}>
        <img src={AddIcon} alt="" />
        <span>Add Activity</span>
      </div>
    );
  };
  const _renderTableContent = () => {
    return formattedData.map((item) => {
      return (
        <Row className={styles.tableContent}>
          <Col span={3} className={`${styles.tableContent__firstColumn} ${styles.alignCenter}`}>
            {moment(item.date).locale('en').format(dateFormat)}
          </Col>
          <Col span={21} className={styles.tableContent__remainColumn}>
            {item.activities.map((activity) => {
              return <ActivityCard activity={activity} />;
            })}

            {_renderAddButton()}
          </Col>
        </Row>
      );
    });
  };

  // MAIN AREA
  return (
    <div className={styles.TimelineTable}>
      {_renderTableHeader()}
      {_renderTableContent()}
    </div>
  );
};

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(
  TimelineTable,
);
