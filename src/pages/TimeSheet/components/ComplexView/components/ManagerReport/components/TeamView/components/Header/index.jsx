import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import SearchBar from '@/pages/TimeSheet/components/ComplexView/components/SearchBar';
import styles from './index.less';
import FilterButton from '@/components/FilterButton';

const Header = (props) => {
  const {
    startDate,
    endDate,
    setStartDate = () => {},
    setEndDate = () => {},
    onChangeSearch = () => {},
    activeView = '',
  } = props;

  // HEADER AREA
  const onPrevClick = () => {
    const lastSunday = moment(startDate).add(-1, 'weeks');
    const currentSunday = moment(startDate).add(-1, 'weeks').weekday(7);
    setStartDate(lastSunday);
    setEndDate(currentSunday);
  };

  const onNextClick = () => {
    const nextSunday = moment(startDate).add(1, 'weeks');
    const currentSunday = moment(startDate).add(1, 'weeks').weekday(7);
    setStartDate(nextSunday);
    setEndDate(currentSunday);
  };

  const onDatePickerChange = (dates = []) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  // MAIN AREA
  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
        <CustomRangePicker
          startDate={startDate}
          endDate={endDate}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          onChange={onDatePickerChange}
        />
      </div>
      <div className={styles.Header__right}>
        <FilterButton />
        <SearchBar onChangeSearch={onChangeSearch} activeView={activeView} />
      </div>
    </div>
  );
};

export default connect(() => ({}))(Header);
