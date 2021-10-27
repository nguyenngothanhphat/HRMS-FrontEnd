import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const mockData = [
  {
    month: 'Jan',
    list: [
      {
        date: '09/10/2021',
        holiday: ['Ganesh Chaturthi/Vinayaka Chaturthi'],
      },
    ],
  },
  {
    month: 'Mar',
    list: [
      {
        date: '10/5/2021',
        holiday: ['Dussehra'],
      },
      {
        date: '10/28/2021',
        holiday: ['Kannada Rajyothsava', 'Kewis'],
      },
    ],
  },
];
const dateFormat = 'DD dddd';

const HolidayCalendar = (props) => {
  const { isInModal = false } = props;
  const [monthList, setMonthList] = useState([]);

  // USE EFFECT
  useEffect(() => {
    if (monthList.length === 0) {
      const monthListTemp = [];
      for (let i = 0; i < 12; i += 1) {
        monthListTemp.push(moment().month(i).locale('en').format('MMM'));
      }
      setMonthList(monthListTemp);
    }
  }, []);

  // RENDER UI
  const renderTag = (name, span) => {
    return (
      <Col span={span} className={styles.tag}>
        <div>{name}</div>
      </Col>
    );
  };

  const renderRow = (month, list = []) => {
    // IF REQUIRE TO SHOW ALL MONTH, ENABLE THESE LINES
    // if (list.length === 0) {
    //   return (
    //     <Row
    //       className={`${styles.eachRow} ${styles.borderBottomHr}`}
    //       justify="center"
    //       align="middle"
    //     >
    //       <Col xs={4} xl={3} className={styles.eachRow__left}>
    //         <div>
    //           <span className={styles.monthLabel}>{month}</span>
    //         </div>
    //       </Col>
    //       <Col xs={20} xl={21} className={styles.eachRow__right} />
    //     </Row>
    //   );
    // }

    if (list.length === 0) {
      return '';
    }

    return list.map((item, index) => {
      const holidayCount = item.holiday.length;
      let colSpan = holidayCount > 0 ? 24 / holidayCount : 24;
      if (holidayCount > 3) {
        colSpan = 24;
      }
      return (
        <Row
          className={`${styles.eachRow} ${
            index === list.length - 1 ? styles.borderBottomHr : null
          }`}
          justify="center"
          align="middle"
        >
          <Col xs={4} xl={3} className={styles.eachRow__left}>
            <div>
              {index === 0 && <span className={styles.monthLabel}>{month}</span>}
              <span className={styles.dateLabel}>
                {moment(item.date).locale('en').format(dateFormat)}
              </span>
            </div>
          </Col>
          <Col xs={20} xl={21} className={styles.eachRow__right}>
            <Row gutter={[16, 16]}>
              {item.holiday.map((val) => {
                return renderTag(val, colSpan);
              })}
            </Row>
          </Col>
        </Row>
      );
    });
  };

  const renderUI = () => {
    return (
      <div className={styles.mainContainer} style={isInModal ? { maxHeight: '600px' } : {}}>
        {monthList.map((month) => {
          const find = mockData.find((holiday) => holiday.month === month) || {};
          return renderRow(month, find.list);
        })}
      </div>
    );
  };

  return <div className={styles.HolidayCalendar}>{renderUI()}</div>;
};

export default connect(() => ({}))(HolidayCalendar);
