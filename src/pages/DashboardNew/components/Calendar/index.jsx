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
import CommonModal from './components/CommonModal';

const { TabPane } = Tabs;
const dateFormat = 'DD MMM YYYY';

const Calendar = (props) => {
  const [activeKey, setActiveKey] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const { dispatch, googleCalendarList = [], loadingSyncGoogleCalendar = false } = props;

  // API
  const syncGoogleCalendarAPI = (date) => {
    dispatch({
      type: 'dashboard/syncGoogleCalendarEffect',
      payload: { date },
    });
  };

  // USE EFFECT
  useEffect(() => {
    syncGoogleCalendarAPI(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    // refresh data by date here
  }, [selectedYear]);

  // FUNCTION
  // MY CALENDAR
  const onPreviousDay = () => {
    setSelectedDate(moment(selectedDate).subtract(1, 'days'));
  };

  const onNextDay = () => {
    setSelectedDate(moment(selectedDate).add(1, 'days'));
  };

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
            <TabPane tab="My Calendar" key="1">
              <MyCalendar data={googleCalendarList} loading={loadingSyncGoogleCalendar} />
            </TabPane>
            <TabPane tab="Holiday Calendar" key="2">
              <HolidayCalendar />
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div className={styles.viewAllMeetingBtn} onClick={() => setModalVisible(true)}>
        {activeKey === '1' && <span>View all Meetings</span>}
        {activeKey === '2' && <span>View all Holiday</span>}
        <img src={LeftArrow} alt="expand" />
      </div>

      <CommonModal
        visible={modalVisible}
        title={activeKey === '2' ? `Holiday Calendar ${selectedYear}` : 'My Calendar'}
        onClose={() => setModalVisible(false)}
        tabKey={activeKey}
        data={activeKey === '2' ? [] : googleCalendarList}
        loading={loadingSyncGoogleCalendar}
      />
    </div>
  );
};

export default connect(({ dashboard: { googleCalendarList = [] } = {}, loading }) => ({
  googleCalendarList,
  loadingSyncGoogleCalendar: loading.effects['dashboard/syncGoogleCalendarEffect'],
}))(Calendar);
