import { Col, Row, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import MeetingTag from '../MeetingTag';
import styles from './index.less';

const data = [
  {
    summary: 'HRMS Event',
    start: { dateTime: moment('10/18/2021 10:00 am', 'MM/DD/YYYY HH:mm a') },
    end: { dateTime: moment('10/18/2021 01:00 pm', 'MM/DD/YYYY HH:mm a') },
    attendees: [],
    hangoutLink: 'google.com',
  },
  {
    summary: 'HRMS Event',
    start: { dateTime: moment('10/18/2021 12:00 pm', 'MM/DD/YYYY HH:mm a') },
    end: { dateTime: moment('10/18/2021 01:00pm', 'MM/DD/YYYY HH:mm a') },
    attendees: [],
    hangoutLink: 'google.com',
  },
  // {
  //   summary: 'HRMS Event',
  //   start: { dateTime: moment('10/18/2021 01:00 pm', 'MM/DD/YYYY HH:mm a') },
  //   end: { dateTime: moment('10/18/2021 01:30 pm', 'MM/DD/YYYY HH:mm a') },
  //   attendees: [],
  //   hangoutLink: 'google.com',
  // },
  {
    summary: 'HRMS Event',
    start: { dateTime: moment('10/18/2021 01:30 pm', 'MM/DD/YYYY HH:mm a') },
    end: { dateTime: moment('10/18/2021 02:05 pm', 'MM/DD/YYYY HH:mm a') },
    attendees: [],
    hangoutLink: 'google.com',
  },
];

const MyCalendar = (props) => {
  const {
    isInModal = false,
    // data = [],
    loading = false,
  } = props;
  const [hourList, setHourList] = useState([]);
  const [firstHourHasData, setFirstHourHasData] = useState('');

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

  // RENDER UI
  const checkIfEmptyHour = (hour) => {
    const events = data.filter((item) => moment(item.start.dateTime).hour() === hour);
    return events.length === 0;
  };

  const checkIfEventLastManyHour = (startTime, endTime) => {
    const startHours = moment(startTime).hour();
    const endHours = moment(endTime).hour();
    return startHours !== endHours;
  };

  const getEventDuration = (startTime, endTime) => {
    const startHours = moment(startTime).hour();
    const endHours = moment(endTime).hour();
    return endHours - startHours;
  };

  const renderData = () => {
    return hourList.map((hour) => {
      const events = data.filter((item) => moment(item.start.dateTime).hour() === hour);
      const eventCount = events.length;
      let colSpan = eventCount > 0 ? 24 / eventCount : 24;
      if (eventCount > 3) {
        colSpan = 24;
      }

      const isEmptyEvent = events.length === 0;
      if (firstHourHasData > hour + 1 && isEmptyEvent) return null;
      return (
        <Col xs={24} className={styles.eachRow}>
          <div className={styles.tags}>
            <Row gutter={[16, 16]}>
              {events.map((event, index) => {
                // current event
                const eventDuration = getEventDuration(event.start.dateTime, event.end.dateTime);
                const eventLastManyHour = checkIfEventLastManyHour(
                  event.start.dateTime,
                  event.end.dateTime,
                );
                // // previous event
                // const prevEvent = index !== 0 ? events[index - 1] : {};
                // const prevEventDuration = getEventDuration(
                //   prevEvent.start.dateTime,
                //   prevEvent.end.dateTime,
                // );
                // const prevEventLastManyHour = checkIfEventLastManyHour(
                //   prevEvent.start.dateTime,
                //   prevEvent.end.dateTime,
                // );
                // // next event
                // const nextEvent = index !== events.length - 1 ? events[index + 1] : {};
                // const nextEventDuration = getEventDuration(
                //   nextEvent.start.dateTime,
                //   nextEvent.end.dateTime,
                // );
                // const nextEventLastManyHour = checkIfEventLastManyHour(
                //   nextEvent.start.dateTime,
                //   prevEvent.end.dateTime,
                // );

                return <MeetingTag span={colSpan} event={event} hourSpan={eventDuration} />;
              })}
            </Row>
          </div>
        </Col>
      );
    });
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

    const renderHour = (h) => {
      if (h < 12) return `${h} AM`;
      if (h === 12) return `12 PM`;
      return `${h - 12} PM`;
    };

    return (
      <div className={styles.mainContainer} style={isInModal ? { maxHeight: '600px' } : {}}>
        <Row className={styles.rows}>
          <Col xs={4} xl={3}>
            <Row className={styles.rows__left}>
              {hourList.map((hour) => {
                const isEmptyEvent = checkIfEmptyHour(hour);
                if (firstHourHasData > hour + 1 && isEmptyEvent) return null;
                return (
                  <Col span={24} className={styles.hour}>
                    {renderHour(hour)}
                  </Col>
                );
              })}
            </Row>
          </Col>
          <Col xs={20} xl={21}>
            <Row className={styles.rows__right}>{renderData()}</Row>
          </Col>
        </Row>
      </div>
    );
  };

  return <div className={styles.MyCalendar}>{renderUI()}</div>;
};

export default connect(() => ({}))(MyCalendar);
