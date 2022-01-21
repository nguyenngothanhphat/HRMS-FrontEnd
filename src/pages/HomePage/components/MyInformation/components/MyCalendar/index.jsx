import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getIsSigninGoogle } from '@/utils/authority';
import GoogleSync from '@/pages/Dashboard/components/Calendar/components/GoogleSync';
import MyCalendarComponent from '@/pages/Dashboard/components/Calendar/components/MyCalendar';
import styles from './index.less';

const isGoogleSignIn = getIsSigninGoogle();

const MyCalendar = (props) => {
  const [selectedDate] = useState(moment().format());
  const [isSyncSuccess, setIsSyncSuccess] = useState(false);
  const { dispatch, googleCalendarList = [], loadingSyncGoogleCalendar = false } = props;
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

  // MAIN
  return (
    <div className={styles.MyCalendar}>
      {isSyncSuccess && isGoogleSignIn ? (
        <MyCalendarComponent
          data={googleCalendarList}
          loading={loadingSyncGoogleCalendar}
          selectedDate={selectedDate}
        />
      ) : (
        <GoogleSync />
      )}
    </div>
  );
};

export default connect(
  ({ dashboard: { googleCalendarList = [] } = {}, loading, user: { currentUser = {} } = {} }) => ({
    googleCalendarList,
    loadingSyncGoogleCalendar: loading.effects['dashboard/syncGoogleCalendarEffect'],
    currentUser,
  }),
)(MyCalendar);
