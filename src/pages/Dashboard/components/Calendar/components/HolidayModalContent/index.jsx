import React from 'react';
import { connect } from 'umi';
import EmptyComponent from '@/components/Empty';
import HolidayCalendar from '../HolidayCalendar';
import MyCalendar from '../MyCalendar';

const HolidayModalContent = (props) => {
  const { tabKey = '', data = [], loading = false, selectedDate = '' } = props;

  const renderModalContent = () => {
    if (data.length === 0) return <EmptyComponent />;
    switch (tabKey) {
      case '1':
        return <MyCalendar isInModal data={data} loading={loading} selectedDate={selectedDate} />;
      case '2':
        return <HolidayCalendar isInModal listHolidays={data} loading={loading} />;
      default:
        return '';
    }
  };

  return <div style={{ paddingBottom: 16 }}>{renderModalContent()}</div>;
};

export default connect(() => ({}))(HolidayModalContent);
