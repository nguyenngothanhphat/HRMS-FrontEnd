import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const dateFormat = 'DD dddd';

const HolidayCalendar = (props) => {
  const { isInModal = false, listHolidays = [] } = props;
  const [monthList, setMonthList] = useState([]);
  // const check = listHolidays.filter((obj) => obj.date.dateTime.month === '1') || [];
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

  const formatData = () => {
    return monthList.map((month, index) => {
      const monthHolidays = listHolidays.filter(
        (holiday) => holiday.date.dateTime.month === (index + 1).toString(),
      );
      const getDaysHaveHoliday = [...new Set(monthHolidays.map((x) => x.date.iso))];
      getDaysHaveHoliday.sort((a, b) =>moment(a).format('YYYYMMDD') - moment(b).format('YYYYMMDD'));
      return {
        month,
        list: getDaysHaveHoliday.map((y) => {
          return {
            date: y,
            holidays: monthHolidays.filter((z) => {
              return (
                moment(z.date.dateTime.day, 'DD').format('DD') ===
                moment(y, 'YYYY-MM-DD').format('DD')
              );
            }),
          };
        }),
      };
    });
  };

  const renderRow = (month, list = []) => {
    if (list.length === 0) {
      return '';
    }

    return list.map((item, index) => {
      const holidayCount = item.holidays.length;
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
                {moment(item.date, 'YYYY-MM-DD').locale('en').format(dateFormat)}
              </span>
            </div>
          </Col>
          <Col xs={20} xl={21} className={styles.eachRow__right}>
            <Row gutter={[16, 16]}>
              {item.holidays.map((val) => {
                return renderTag(val.name, colSpan);
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
          const find = formatData().find((holiday) => holiday.month === month) || {};
          return renderRow(month, find.list);
        })}
      </div>
    );
  };

  return <div className={styles.HolidayCalendar}>{renderUI()}</div>;
};

export default connect(() => ({}))(HolidayCalendar);
