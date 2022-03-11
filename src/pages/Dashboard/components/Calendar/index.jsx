import { Tabs } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import SmallRightArrow from '@/assets/dashboard/smallRightArrow.svg';
import SmallLeftArrow from '@/assets/dashboard/smallLeftArrow.svg';
import LeftArrow from '@/assets/dashboard/leftArrow.svg';
import styles from './index.less';
import MyCalendar from './components/MyCalendar';
import HolidayCalendar from './components/HolidayCalendar';
import GoogleSync from './components/GoogleSync';
import CommonModal from './components/CommonModal';
import { getIsSigninGoogle } from '@/utils/authority';

const { TabPane } = Tabs;
const dateFormat = 'DD MMM YYYY';
const isGoogleSignIn = getIsSigninGoogle();

const Calendar = (props) => {
  const [activeKey, setActiveKey] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format());
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [isSyncSuccess, setIsSyncSuccess] = useState(false);
  const {
    dispatch,
    googleCalendarList = [],
    holidaysListByCountry = [],
    loadingSyncGoogleCalendar = false,
    currentUser: { location = {} } = {},
  } = props;

  // API
  const syncGoogleCalendarAPI = async (date) => {
    const res = await dispatch({
      type: 'dashboard/syncGoogleCalendarEffect',
      payload: { date },
    });
    if (res?.statusCode === 200) {
      setIsSyncSuccess(true);
    }
  };

  // USE EFFECT
  useEffect(() => {
    return () => {
      setIsSyncSuccess(false);
    };
  }, []);

  useEffect(() => {
    if (isGoogleSignIn) {
      syncGoogleCalendarAPI(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    // refresh data by date here
  }, [selectedYear]);

  // FUNCTION
  // MY CALENDAR
  const onPreviousDay = () => {
    setSelectedDate(moment(selectedDate).subtract(1, 'days').format());
  };

  const onNextDay = () => {
    setSelectedDate(moment(selectedDate).add(1, 'days').format());
  };
  useEffect(() => {
    const country = location ? location.headQuarterAddress.country._id : '';
    dispatch({
      type: 'dashboard/fetchHolidaysByCountry',
      payload: {
        country,
      },
    });
  }, []);

  // const handleTimeZoneData = googleCalendarList.

  const renderMyCalendarAction = () => {
    return (
      <div className={styles.header__actions}>
        <img src={SmallLeftArrow} alt="" onClick={onPreviousDay} />
        <span>{moment(selectedDate).locale('en').format(dateFormat)}</span>
        <img src={SmallRightArrow} alt="" onClick={onNextDay} />
      </div>
    );
  };

  // HOLIDAY CALENDAR
  const onPreviousYear = () => {
    setSelectedYear(selectedYear - 1);
  };

  const onNextYear = () => {
    setSelectedYear(selectedYear + 1);
  };

  const filterHoliday =
    holidaysListByCountry.filter((obj) => obj.date.dateTime.year === selectedYear.toString()) || [];

  const addZeroToNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
  };

  const getTabName = (key) => {
    return `${key} (${addZeroToNumber(googleCalendarList.length)})`;
  };

  const renderHolidayCalendarAction = () => {
    return (
      <div className={styles.header__actions}>
        <img src={SmallLeftArrow} alt="" onClick={onPreviousYear} />
        <span>{selectedYear}</span>
        <img src={SmallRightArrow} alt="" onClick={onNextYear} />
      </div>
    );
  };

  // MAIN
  return (
    <div className={styles.Calendar}>
      <div>
        <div className={styles.header}>
          <span className={styles.header__headerText}>Calendar</span>
          {activeKey === '1' && renderMyCalendarAction()}
          {activeKey === '2' && renderHolidayCalendarAction()}
        </div>
        <div className={styles.content}>
          <Tabs activeKey={activeKey} onTabClick={(key) => setActiveKey(key)}>
            <TabPane tab={getTabName('My Calendar')} key="1">
              {isSyncSuccess && isGoogleSignIn ? (
                <MyCalendar
                  data={googleCalendarList}
                  loading={loadingSyncGoogleCalendar}
                  selectedDate={selectedDate}
                />
              ) : (
                <GoogleSync />
              )}
            </TabPane>
            <TabPane tab="Holiday Calendar" key="2">
              <HolidayCalendar listHolidays={filterHoliday} />
            </TabPane>
          </Tabs>
        </div>
      </div>

      {activeKey === '1' && googleCalendarList.length > 0 && (
        <div className={styles.viewAllMeetingBtn} onClick={() => setModalVisible(true)}>
          <span>View all Meetings</span>
          <img src={LeftArrow} alt="expand" />
        </div>
      )}

      {activeKey === '2' && holidaysListByCountry.length > 0 && (
        <div className={styles.viewAllMeetingBtn} onClick={() => setModalVisible(true)}>
          <span>View all Holidays</span>
          <img src={LeftArrow} alt="expand" />
        </div>
      )}
      <CommonModal
        visible={modalVisible}
        title={activeKey === '2' ? `Holiday Calendar ${selectedYear}` : 'My Calendar'}
        onClose={() => setModalVisible(false)}
        tabKey={activeKey}
        data={activeKey === '2' ? filterHoliday : googleCalendarList}
        loading={loadingSyncGoogleCalendar}
        dateSelected={selectedDate}
      />
    </div>
  );
};

export default connect(
  ({
    dashboard: { googleCalendarList = [], holidaysListByCountry = [] } = {},
    loading,
    user: { currentUser = {} } = {},
  }) => ({
    googleCalendarList,
    loadingSyncGoogleCalendar: loading.effects['dashboard/syncGoogleCalendarEffect'],
    holidaysListByCountry,
    currentUser,
    loadingHolidays: loading.effects['dashboard/fetchHolidaysByCountry'],
  }),
)(Calendar);
