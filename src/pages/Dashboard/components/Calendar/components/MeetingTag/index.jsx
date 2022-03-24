import { Button, Col, Popover, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import Bell from '@/assets/dashboard/bell.svg';
import CloseX from '@/assets/dashboard/closeX.svg';
import GoogleMeet from '@/assets/dashboard/googleMeet.svg';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import { CALENDAR_COLORS, DEFAULT_MARGIN_CALENDAR, EMP_ROW_HEIGHT } from '@/utils/dashboard';
import styles from './index.less';

const timeFormat = 'HH:mm a';

const MeetingTag = (props) => {
  const myRef = useRef(null);
  const { event: eventProp, selectedDate = '', slotArr = [], cardIndex = 0 } = props;
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
  const [marginLeft, setMarginLeft] = useState(DEFAULT_MARGIN_CALENDAR);
  const [marginRight, setMarginRight] = useState(DEFAULT_MARGIN_CALENDAR);
  const [activeColor, setActiveColor] = useState(CALENDAR_COLORS.GREEN.color);
  const [borderColor, setBorderColor] = useState(CALENDAR_COLORS.GREEN.borderColor);
  const [backgroundColor, setBackgroundColor] = useState(CALENDAR_COLORS.GREEN.backgroundColor);

  // USE EFFECT AREA
  const calculateCardPosition = () => {
    const marginBlock = DEFAULT_MARGIN_CALENDAR * 2;

    let topTemp = 10;
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

      if (position === columnCount - 1) {
        setMarginRight(DEFAULT_MARGIN_CALENDAR * 2);
        setMarginLeft(DEFAULT_MARGIN_CALENDAR);
      }
      if (position === 0) {
        setMarginLeft(DEFAULT_MARGIN_CALENDAR * 2);
      }
    }
  };

  // FUNCTIONS
  const getColor = (index) => {
    const indexTemp = index % 5;
    let { colorTemp } = CALENDAR_COLORS.GREEN;
    let { backgroundColorTemp } = CALENDAR_COLORS.GREEN;
    let { borderColorTemp } = CALENDAR_COLORS.GREEN;
    switch (indexTemp) {
      case 1:
        colorTemp = CALENDAR_COLORS.ORANGE.color;
        backgroundColorTemp = CALENDAR_COLORS.ORANGE.backgroundColor;
        borderColorTemp = CALENDAR_COLORS.ORANGE.borderColor;
        break;
      case 2:
        colorTemp = CALENDAR_COLORS.RED.color;
        backgroundColorTemp = CALENDAR_COLORS.RED.backgroundColor;
        borderColorTemp = CALENDAR_COLORS.RED.borderColor;
        break;
      case 3:
        colorTemp = CALENDAR_COLORS.GRAY.color;
        backgroundColorTemp = CALENDAR_COLORS.GRAY.backgroundColor;
        borderColorTemp = CALENDAR_COLORS.GRAY.borderColor;
        break;
      default:
        colorTemp = CALENDAR_COLORS.GREEN.color;
        backgroundColorTemp = CALENDAR_COLORS.GREEN.backgroundColor;
        borderColorTemp = CALENDAR_COLORS.GREEN.borderColor;
        break;
    }
    setActiveColor(colorTemp);
    setBorderColor(borderColorTemp);
    setBackgroundColor(backgroundColorTemp);
  };

  useEffect(() => {
    if (slotArr.length > 0) {
      calculateCardPosition();
    }
    getColor(cardIndex);
  }, [JSON.stringify(eventProp), JSON.stringify(slotArr)]);

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
            <div
              className={styles.colorBox}
              style={{
                backgroundColor: activeColor,
              }}
            />
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
          className={styles.MeetingTag}
          ref={myRef}
          style={{
            top,
            height,
            left,
            right,
            marginRight,
            marginLeft,
            backgroundColor,
            border: `1px solid ${borderColor}`,
            color: activeColor,
            paddingBlock: height < EMP_ROW_HEIGHT ? 8 : 16,
          }}
        >
          <span className={styles.title}>{event.summary}</span>

          {height > EMP_ROW_HEIGHT && (
            <span className={styles.extraTime}>
              {moment(event.start.dateTime).format(timeFormat)} -{' '}
              {moment(event.end.dateTime).format(timeFormat)}
            </span>
          )}
        </div>
      </Popover>
    );
  };

  return renderTag(eventProp);
};

export default connect(() => ({}))(MeetingTag);
