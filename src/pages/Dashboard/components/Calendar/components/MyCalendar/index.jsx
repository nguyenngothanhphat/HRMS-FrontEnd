import { Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import MeetingTag from '../MeetingTag';
import styles from './index.less';

const MyCalendar = (props) => {
  const { isInModal = false, data = [], loading = false } = props;
  const [hourList, setHourList] = useState([]);
  const [firstHourHasData, setFirstHourHasData] = useState('');

  const [dateToFormat, setdateToFormat] = useState(moment().format('HH:mm'))

  const updateTime = () => {
    return moment().format('HH:mm')
  }

  useEffect(() => {
    setInterval(() => setdateToFormat(updateTime, 1000));
  },[]);

  // USE EFFECT
  useEffect(() => {
    if (hourList.length === 0) {
      const hourListTemp = [];
      for (let i = 0; i < 24; i += 1) {
        hourListTemp.push(i);
      }
      setHourList(hourListTemp);
    }
  }, []);

  // FIND THE FIRST HOUR IN DATE THAT HAS EVENT
  useEffect(() => {
    let firstIndex = null;
    for (let i = 0; i < 24; i += 1) {
      const x = data.find((item) => moment(item.start.dateTime).hour() === i);
      if (x && !firstIndex) {
        firstIndex = i;
        break;
      }
    }
    setFirstHourHasData(firstIndex);
  }, [JSON.stringify(data)]);

  const renderCurrentDate = (hour, currentDate, timeEvent) => {
    const currentTime = currentDate ? currentDate.split(':')[0] : moment().format('HH')
    const minute = currentDate ? currentDate.split(':')[1] / 60 : moment().format('mm') / 60
    if(minute < 0.65){
      if(hour - Number(currentTime) === 0 && timeEvent - Number(currentTime) !== 0){
        if(minute < 0.05){return (<hr className={styles.currentTime} />)}
        if(minute >= 0.05 && minute < 0.1){return (<hr className={styles.currentTime1} />)}
        if(minute >= 0.1 && minute < 0.15){return (<hr className={styles.currentTime2} />)}
        if(minute >= 0.15 && minute < 0.2){return (<hr className={styles.currentTime3} />)}
        if(minute >= 0.2 && minute < 0.25){return (<hr className={styles.currentTime4} />)}
        if(minute >= 0.25 && minute < 0.3){return (<hr className={styles.currentTime5} />)}
        if(minute >= 0.3 && minute < 0.35){return (<hr className={styles.currentTime6} />)}
        if(minute >= 0.35 && minute < 0.4){return (<hr className={styles.currentTime7} />)}
        if(minute >= 0.4 && minute < 0.5){return (<hr className={styles.currentTime8} />)}
        if(minute >= 0.5 && minute < 0.55){return (<hr className={styles.currentTime9} />)}
        if(minute >= 0.55 && minute < 0.6){return (<hr className={styles.currentTime10} />)}
        if(minute >= 0.6 && minute < 0.65){return (<hr className={styles.currentTime11} />)}
      }
    }
    if(minute >= 0.65){
      if(hour - (Number(currentTime)+1) === 0 && timeEvent - (Number(currentTime)+1) !== 0){
        if(minute < 0.75){ return (<hr className={styles.currentTime12} />)}
        if(minute >= 0.75 && minute < 0.85){ return (<hr className={styles.currentTime13} />)}
        if(minute >= 0.85 && minute < 1){ return (<hr className={styles.currentTime14} />)}
      }
    }
    return ''
  }
  setInterval(() => {
    renderCurrentDate()
  }, 1000);

  // RENDER UI
  const renderRow = (hour, events = []) => {
    const eventCount = events.length;
    let colSpan = eventCount > 0 ? 24 / eventCount : 24;
    if (eventCount > 3) {
      colSpan = 24;
    }
    const timeEvent = events.length > 0 ? moment(events[0].start.dateTime).hour() : -1;
    const renderHour = (h) => {
      if (hour < 12) return `${h} AM`;
      if (hour === 12) return `12 PM`;
      return `${h - 12} PM`;
    };

    // if (firstHourHasData > hour + 2 && events.length === 0) return null;
    return (
      <Row className={styles.eachRow} justify="center" align="middle">
        <Col xs={4} xl={3} className={styles.eachRow__left}>
          <div>{renderHour(hour)}</div>
        </Col>
        <Col xs={20} xl={21} className={styles.eachRow__right}>
          <Row gutter={[16, 16]}>
            {renderCurrentDate(hour, dateToFormat, timeEvent)}
            {events.map((event) => {
              return (
                <MeetingTag
                  span={colSpan}
                  event={event}
                  isFirstHourHasData={hour === firstHourHasData}
                />
              );
            })}
          </Row>
        </Col>
      </Row>
    );
  };

  const renderUI = () => {
    if (loading)
      return (
        <div
          className={styles.mainContainer}
          style={{
            minHeight: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin size="default" />
        </div>
      );
    return (
      <div className={styles.mainContainer} style={isInModal ? { maxHeight: '600px' } : {}}>
        {hourList.map((hour) => {
          const filter = data.filter((item) => moment(item.start.dateTime).hour() === hour);
          return renderRow(hour, filter);
        })}
      </div>
    );
  };

  return <div className={styles.MyCalendar}>{renderUI()}</div>;
};

export default connect(() => ({}))(MyCalendar);
