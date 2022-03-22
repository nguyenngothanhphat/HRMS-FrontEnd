import { Button, Col, Popover, Row } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import Bell from '@/assets/dashboard/bell.svg';
import CloseX from '@/assets/dashboard/closeX.svg';
import ColorBox from '@/assets/dashboard/colorBox.svg';
import GoogleMeet from '@/assets/dashboard/googleMeet.svg';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';

const EMP_ROW_HEIGHT = 72;
const timeFormat = 'HH:mm a';

const MeetingTag = (props) => {
  const myRef = useRef(null);
  const { event: eventProp, cardIndex = 0, selectedDate = '', slotArr = [] } = props;
  const [showPopover, setShowPopover] = useState(false);

  const {
    id: eventID = '',
    start: { dateTime: startTime = '' } = {},
    end: { dateTime: endTime = '' } = {},
  } = eventProp;

  const [top, setTop] = useState(0);
  const [height, setHeight] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);

  // USE EFFECT AREA
  const calculateCardPosition = () => {
    const marginBlock = 10;

    let topTemp = EMP_ROW_HEIGHT / 2;
    let heightTemp = 0;

    if (startTime && endTime) {
      const startTimeHourTemp = moment(startTime).hour();
      const startTimeMinuteTemp = moment.utc(startTime).minute();

      for (let i = 0; i <= 24; i += 1) {
        if (i < startTimeHourTemp) {
          topTemp += EMP_ROW_HEIGHT;
        } else if (i === startTimeHourTemp) {
          topTemp += (startTimeMinuteTemp / 60) * EMP_ROW_HEIGHT;
        }
      }

      const diff = moment.duration(moment(endTime).diff(moment(startTime)));
      heightTemp = diff.asHours() * EMP_ROW_HEIGHT;

      setTop(topTemp + marginBlock / 2);
      setHeight(heightTemp - marginBlock);

      const listBySlotArr = slotArr.filter((x) => x.includes(eventID));
      let columnCount = 0;
      let position = 0;
      listBySlotArr.forEach((x) => {
        if (x.length > columnCount) {
          columnCount = x.length;
          position = x.indexOf(eventID);
        }
      });
      const leftTemp = position / (position + 1);
      setLeft(`${leftTemp * 100}%`);
      const rightTemp = leftTemp + 1 / columnCount;
      setRight(`${100 - rightTemp * 100}%`);
    }
  };

  useEffect(() => {
    if (slotArr.length > 0) {
      calculateCardPosition();
    }
  }, [JSON.stringify(eventProp), JSON.stringify(slotArr)]);

  // FUNCTIONS
  const getColorClassName = (type) => {
    switch (type) {
      // case 1:
      //   return styles.greenTag;
      // case 2:
      //   return styles.orangeTag;
      // case 3:
      //   return styles.redTag;
      // case 4:
      //   return styles.whiteTag;
      default:
        return styles.greenTag;
    }
  };

  const joinGGMeet = (link) => {
    window.open(link, '_blank').focus();
  };

  // RENDER POPUP EVENT
  const renderGuest = (attendee) => {
    const { email = '', organizer = false, self = false, avatar = '', displayName = '' } = attendee;
    const getIdViaEmail = () => {
      return email.substring(0, email.lastIndexOf('@'));
    };

    const getAvatarClassName = () => {
      if (organizer) return styles.organizer;
      if (self) return styles.self;
      return null;
    };

    return (
      <Row className={styles.employee} align="middle">
        <Col span={3} className={styles.avatar}>
          {avatar ? (
            <img className={getAvatarClassName()} src={avatar || MockAvatar} alt="" />
          ) : (
            <div className={`${styles.textAvatar} ${getAvatarClassName()}`}>{email.charAt(0)}</div>
          )}
        </Col>
        <Col span={21} className={styles.right}>
          <span className={styles.name}>{displayName || email}</span>
          <span className={styles.id}>({getIdViaEmail()})</span>
        </Col>
      </Row>
    );
  };
  const renderPopupEvent = (event) => {
    const {
      summary = '',
      attendees = [],
      hangoutLink = '',
      // conferenceData = {}
    } = event || {};

    const eventDate = moment(startTime).locale('en').format('dddd, MMMM DD');
    const eventStartTime = moment(startTime).format('HH:mm a');
    const eventEndTime = moment(endTime).format('HH:mm a');
    const eventFinalDate = `${eventDate} - ${eventStartTime} - ${eventEndTime}`;

    return (
      <div className={styles.popupEvent}>
        <img
          className={styles.closeButton}
          src={CloseX}
          alt=""
          onClick={() => setShowPopover(!showPopover)}
        />
        <Row className={styles.popupEvent__header}>
          <Col span={3}>
            <img src={ColorBox} alt="" />
          </Col>
          <Col span={21}>
            <div className={styles.rightPart}>
              <span className={styles.title}>{summary}</span>
              <span className={styles.time}>{eventFinalDate}</span>
            </div>
          </Col>
        </Row>
        <div className={styles.divider} />
        <Row className={styles.popupEvent__link}>
          <Col span={3}>
            <img src={GoogleMeet} alt="" />
          </Col>
          <Col span={21}>
            <div className={styles.rightPart}>
              <Button className={styles.button} onClick={() => joinGGMeet(hangoutLink)}>
                Join with Google Meet
              </Button>
              <span className={styles.url}>{hangoutLink.replace(/(^\w+:|^)\/\//, '')}</span>
            </div>
          </Col>
        </Row>
        <div className={styles.divider} />
        <p className={styles.guestNumber}>{attendees.length} Guests</p>
        <div className={styles.popupEvent__employeeContainer}>
          {attendees.map((attendee) => renderGuest(attendee))}
        </div>
        <div className={styles.divider} />
        <Row className={styles.popupEvent__alarmBell}>
          <img src={Bell} alt="" />
          <span>15 mins before</span>
        </Row>
      </div>
    );
  };

  // RENDER UI
  const renderTag = (event) => {
    const min = Math.ceil(1);
    const max = Math.floor(4);
    const colorType = Math.floor(Math.random() * (max - min) + min);
    const colorClassName = getColorClassName(colorType);

    const localDate = moment(selectedDate).format('MM/DD/YYYY');
    const googleDate = moment(event.start.dateTime).format('MM/DD/YYYY');

    if (localDate !== googleDate) return '';
    return (
      <Popover
        placement="rightTop"
        content={() => renderPopupEvent(event)}
        title={null}
        trigger="click"
        visible={showPopover}
        overlayClassName={styles.popupEventContainer}
        onVisibleChange={() => setShowPopover(!showPopover)}
      >
        <div
          // span={span}
          className={styles.MeetingTag}
          ref={myRef}
          style={{
            top,
            height,
            left,
            right,
          }}
        >
          <div className={`${colorClassName}`}>
            {event.summary && event.summary.length > 20
              ? `${event.summary.slice(0, 20)} ...`
              : event.summary}

            {height > EMP_ROW_HEIGHT && (
              <span className={styles.extraTime}>
                {moment(event.start.dateTime).format(timeFormat)} -{' '}
                {moment(event.end.dateTime).format(timeFormat)}
              </span>
            )}
          </div>
        </div>
      </Popover>
    );
  };

  return renderTag(eventProp);
};

export default connect(() => ({}))(MeetingTag);
