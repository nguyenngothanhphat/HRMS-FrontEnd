import { Button, Col, Popover, Row } from 'antd';
import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import Bell from '@/assets/dashboard/bell.svg';
import CloseX from '@/assets/dashboard/closeX.svg';
import ColorBox from '@/assets/dashboard/colorBox.svg';
import GoogleMeet from '@/assets/dashboard/googleMeet.svg';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';

const timeFormat = 'HH:mm a';
const MeetingTag = (props) => {
  const myRef = useRef(null);
  const { event: eventProp, span: spanProp, hourSpan: hourSpanProp = 1 } = props;
  const [showPopover, setShowPopover] = useState(false);

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

  const getTagClassName = () => {
    if (hourSpanProp === 2) return styles.div2;
    if (hourSpanProp === 3) return styles.div3;
    if (hourSpanProp === 4) return styles.div4;
    return null;
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
      start: { dateTime: startTime = '' } = {},
      end: { dateTime: endTime = '' } = {},
      attendees = [],
      hangoutLink = '',
      // conferenceData = {}
    } = event || {};
    // const selectedDate = dateSelected ? moment(dateSelected).format('DD') : moment().format('DD');
    // console.log('cgecc', moment(startTime).locale('en').tz(moment.tz.guess()).format('dddd, MMMM DD'))
    // if (Number(moment(startTime).locale('en').format('DD')) === Number(selectedDate)) {
    //   eventDate = moment(startTime).locale('en').format('dddd, MMMM DD');
    // } else if (Number(moment(startTime).locale('en').format('DD')) < Number(selectedDate)) {
    //   eventDate = moment(startTime).locale('en').add(1, 'days').format('dddd, MMMM DD');
    // } else {
    //   eventDate = moment(startTime).locale('en').subtract(1, 'days').format('dddd, MMMM DD');
    // }
    const eventDate = moment(startTime.split('+')[0]).locale('en').format('dddd, MMMM DD');
    const eventStartTime = moment(startTime.split('+')[0]).format('HH:mm a');
    const eventEndTime = moment(endTime).split('+')[0].format('HH:mm a');
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
  const renderTag = (event, span) => {
    const min = Math.ceil(1);
    const max = Math.floor(4);
    const colorType = Math.floor(Math.random() * (max - min) + min);
    const colorClassName = getColorClassName(colorType);
    const tagClassName = getTagClassName(hourSpanProp);
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
        <Col span={span} className={styles.MeetingTag} ref={myRef}>
          <div className={`${colorClassName} ${tagClassName}`}>
            {event.summary}
            {hourSpanProp > 1 && (
              <span className={styles.extraTime}>
                {moment((event.start.dateTime).split('+')[0]).format(timeFormat)} -{' '}
                {moment((event.end.dateTime).split('+')[0]).format(timeFormat)}
              </span>
            )}
          </div>
        </Col>
      </Popover>
    );
  };

  return renderTag(eventProp, spanProp);
};

export default connect(() => ({}))(MeetingTag);
