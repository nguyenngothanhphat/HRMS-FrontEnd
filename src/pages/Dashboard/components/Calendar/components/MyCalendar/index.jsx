import { Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import MeetingTag from '../MeetingTag';
import styles from './index.less';

const MyCalendar = (props) => {
  const { isInModal = false, data = [], loading = false, selectedDate = '' } = props;
  const [hourList, setHourList] = useState([]);

  const [dateToFormat, setDateToFormat] = useState(moment().format('HH:mm'));

  const updateTime = () => {
    return moment().format('HH:mm');
  };

  const scrollCurrentTime = () => {
    return document.getElementById('checkCurrentTime')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };
  useEffect(() => {
    if (isInModal === true) {
      scrollCurrentTime();
    }
  });

  // USE EFFECT
  useEffect(() => {
    if (hourList.length === 0) {
      const hourListTemp = [];
      for (let i = 0; i < 24; i += 1) {
        hourListTemp.push(i);
      }
      setHourList(hourListTemp);
    }
    setInterval(() => setDateToFormat(updateTime, 1000));
  }, []);

  const renderCurrentDate = (hour, currentDate) => {
    const currentTime = currentDate ? currentDate.split(':')[0] : moment().format('HH');
    const minute = currentDate ? currentDate.split(':')[1] / 60 : moment().format('mm') / 60;
    // && timeEvent - Number(currentTime) !== 0 && timeEvent - (Number(currentTime)+1) !== 0
    if (minute < 0.8) {
      if (hour - Number(currentTime) === 0) {
        if (minute < 0.05) {
          return <hr className={styles.currentTime} id="currentTimeId" />;
        }
        if (minute >= 0.05 && minute < 0.1) {
          return <hr className={styles.currentTime1} id="currentTimeId" />;
        }
        if (minute >= 0.1 && minute < 0.15) {
          return <hr className={styles.currentTime2} id="currentTimeId" />;
        }
        if (minute >= 0.15 && minute < 0.2) {
          return <hr className={styles.currentTime3} id="currentTimeId" />;
        }
        if (minute >= 0.2 && minute < 0.25) {
          return <hr className={styles.currentTime4} id="currentTimeId" />;
        }
        if (minute >= 0.25 && minute < 0.3) {
          return <hr className={styles.currentTime5} id="currentTimeId" />;
        }
        if (minute >= 0.3 && minute < 0.35) {
          return <hr className={styles.currentTime6} id="currentTimeId" />;
        }
        if (minute >= 0.35 && minute < 0.4) {
          return <hr className={styles.currentTime7} id="currentTimeId" />;
        }
        if (minute >= 0.4 && minute < 0.5) {
          return <hr className={styles.currentTime8} id="currentTimeId" />;
        }
        if (minute >= 0.5 && minute < 0.55) {
          return <hr className={styles.currentTime9} id="currentTimeId" />;
        }
        if (minute >= 0.55 && minute < 0.6) {
          return <hr className={styles.currentTime10} id="currentTimeId" />;
        }
        if (minute >= 0.6 && minute < 0.65) {
          return <hr className={styles.currentTime11} id="currentTimeId" />;
        }
        if (minute >= 0.65 && minute < 0.7) {
          return <hr className={styles.currentTime12} id="currentTimeId" />;
        }
        if (minute >= 0.7 && minute < 0.75) {
          return <hr className={styles.currentTime13} id="currentTimeId" />;
        }
        if (minute >= 0.75 && minute < 0.8) {
          return <hr className={styles.currentTime14} id="currentTimeId" />;
        }
      }
    }
    if (minute >= 0.8) {
      if (hour - (Number(currentTime) + 1) === 0) {
        if (minute < 0.9) {
          return <hr className={styles.currentTime15} id="currentTimeId" />;
        }
        if (minute >= 0.9 && minute < 1) {
          return <hr className={styles.currentTime16} id="currentTimeId" />;
        }
      }
    }
    return '';
  };

  const checkCurrentTime = (hour) => {
    if (Number(moment().format('HH')) === hour) {
      return <div id="checkCurrentTime" />;
    }
    return '';
  };

  // RENDER UI
  const renderRow = (hour, events = []) => {
    const eventCount = events.length;
    let colSpan = eventCount > 0 ? 24 / eventCount : 24;
    if (eventCount > 3) {
      colSpan = 24;
    }
    // const timeEvent = events.length > 0 ? moment(events[0].start.dateTime).hour() : -1;
    const renderHour = (h) => {
      if (hour < 12) return `${h} AM`;
      if (hour === 12) return `12 PM`;
      return `${h - 12} PM`;
    };

    return (
      <Row className={styles.eachRow} justify="center" align="top">
        <Col xs={4} className={styles.eachRow__left}>
          <div>{renderHour(hour)}</div>
        </Col>
        <Col xs={20} className={styles.eachRow__right}>
          <Row gutter={[16, 16]}>
            {/* {checkCurrentTime(hour)} */}
            {/* {renderCurrentDate(hour, dateToFormat)} */}
            {events.map((event) => {
              return <MeetingTag span={colSpan} event={event} selectedDate={selectedDate} />;
            })}
          </Row>
        </Col>
      </Row>
    );
  };

  const renderHour = (hour) => {
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return `12 PM`;
    return `${hour - 12} PM`;
  };

  const renderUI = () => {
    return (
      <Spin spinning={loading}>
        <Row className={styles.mainContainer} style={isInModal ? { maxHeight: '600px' } : {}}>
          {/* {hourList.map((hour) => {
            const filter = data.filter((item) => moment(item.start.dateTime).hour() === hour);
            return renderRow(hour, filter);
          })} */}

          <Col span={4} className={`${styles.mainContainer__firstColumn} ${styles.alignCenter}`}>
            {hourList.map((hour) => {
              return (
                <div className={styles.hourBlock}>
                  <span>{renderHour(hour)}</span>
                </div>
              );
            })}
          </Col>
          <Col span={20} className={styles.mainContainer__remainColumn}>
            {hourList.map(() => {
              return (
                <div className={styles.row}>
                  <div className={styles.divider} />
                </div>
              );
            })}
            {data.map((item, index) => (
              <MeetingTag cardIndex={index} event={item} selectedDate={selectedDate} />
            ))}
          </Col>
        </Row>
      </Spin>
    );
  };

  return <div className={styles.MyCalendar}>{renderUI()}</div>;
};

export default connect(() => ({}))(MyCalendar);
