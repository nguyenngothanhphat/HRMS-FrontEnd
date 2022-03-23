import { Col, Row, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import MeetingTag from '../MeetingTag';
import styles from './index.less';
import { EMP_ROW_HEIGHT } from '@/utils/dashboard';

const MyCalendar = (props) => {
  const currentTimeLineRef = useRef();

  const { isInModal = false, data = [], loading = false, selectedDate = '' } = props;
  const [hourList, setHourList] = useState([]);
  const [slotArr, setSlotArr] = useState([]);
  const [dataState, setDataState] = useState([]);
  const [currentTimePosition, setCurrentTimePosition] = useState(0);

  const getCurrentTimePosition = () => {
    const currentTime = moment();
    const currentHour = currentTime.hour();
    const currentMinute = currentTime.minute();
    const currentTimePositionTemp =
      currentHour * EMP_ROW_HEIGHT + (currentMinute / 60) * EMP_ROW_HEIGHT + 7;
    setCurrentTimePosition(currentTimePositionTemp);
    currentTimeLineRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };

  const getHoursBetweenTwoHour = (start, end) => {
    const hourListTemp = [];
    for (let i = start; i < end; i += 1) {
      hourListTemp.push(i);
    }
    return hourListTemp;
  };

  const compare = (a, b) => {
    const endTimeA = moment(a.end.dateTime).hour();
    const startTimeA = moment(a.start.dateTime).hour();
    const endTimeB = moment(b.end.dateTime).hour();
    const startTimeB = moment(b.start.dateTime).hour();
    if (endTimeA - startTimeA < endTimeB - startTimeB) {
      return 1;
    }
    if (endTimeA - startTimeA > endTimeB - startTimeB) {
      return -1;
    }
    return 0;
  };

  const sortData = (dataProp) => {
    const dataTemp = dataProp.sort(compare);
    return dataTemp;
  };

  const generateSlotArr = () => {
    const slotArrTemp = [...slotArr];

    for (let i = 0; i < 24; i += 1) {
      const events = dataState.filter((x) => moment(x.start.dateTime).hour() === i);

      if (events.length > 0) {
        events.forEach((ev) => {
          const endTime = moment(ev.end.dateTime).hour();
          const hourListTemp = getHoursBetweenTwoHour(i, endTime);

          if (hourListTemp.length > 0) {
            let maxLength = 0;
            for (let j = 0; j < hourListTemp.length; j += 1) {
              const lengthTemp = slotArrTemp[hourListTemp[j]].length;
              if (lengthTemp > maxLength) {
                maxLength = lengthTemp;
              }
            }

            for (let j = 0; j < hourListTemp.length; j += 1) {
              if (hourListTemp.length === 1) {
                if (!slotArrTemp[hourListTemp[j]][0]) {
                  slotArrTemp[hourListTemp[j]][0] = ev.id;
                } else {
                  slotArrTemp[hourListTemp[j]][1] = ev.id;
                }
              } else {
                slotArrTemp[hourListTemp[j]][maxLength] = ev.id;
              }
            }
          }
        });
      }
    }
    setSlotArr(slotArrTemp);
  };

  // USE EFFECT
  useEffect(() => {
    if (hourList.length === 0) {
      const hourListTemp = [];
      const slotArrTemp = [];
      for (let i = 0; i < 24; i += 1) {
        hourListTemp.push(i);
        slotArrTemp.push([]);
      }
      setHourList(hourListTemp);
      setSlotArr(slotArrTemp);
    }

    // calculate current time position every 10 seconds
    getCurrentTimePosition();
    const interval = setInterval(() => {
      getCurrentTimePosition();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // generate position for each meeting
  useEffect(() => {
    if (dataState.length > 0 && slotArr.length > 0) {
      generateSlotArr();
    }
  }, [JSON.stringify(dataState), JSON.stringify(hourList)]);

  useEffect(() => {
    if (data.length > 0) {
      setDataState(sortData(data));
    }
  }, [JSON.stringify(data)]);

  // RENDER UI
  const renderHour = (hour) => {
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return `12 PM`;
    return `${hour - 12} PM`;
  };

  const renderUI = () => {
    return (
      <Spin spinning={loading}>
        <Row className={styles.mainContainer} style={isInModal ? { maxHeight: '600px' } : {}}>
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
            <div
              className={styles.currentTimeLine}
              ref={currentTimeLineRef}
              style={{
                top: currentTimePosition,
                display: moment(selectedDate).isSame(moment(), 'day') ? 'block' : 'none',
              }}
            />
            {dataState.map((item) => (
              <MeetingTag event={item} selectedDate={selectedDate} slotArr={slotArr} />
            ))}
          </Col>
        </Row>
      </Spin>
    );
  };

  return <div className={styles.MyCalendar}>{renderUI()}</div>;
};

export default connect(() => ({}))(MyCalendar);
