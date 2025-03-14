import { Skeleton } from 'antd';
import moment from 'moment';
import React, { Suspense } from 'react';
import { connect } from 'umi';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { VIEW_TYPE } from '@/constants/timeSheet';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import SearchBar from '@/pages/TimeSheet/components/ComplexView/components/SearchBar';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const Header = (props) => {
  const {
    startDate,
    endDate,
    setStartDate = () => {},
    setEndDate = () => {},
    viewChangeComponent = '',
    type = '',
    onChangeSearch = () => {},
    activeView = '',
    dispatch,
    timeSheet: { filterFinance = {} } = {},
  } = props;

  // HEADER AREA FOR MONTH
  const onPrevClick = () => {
    if (type === VIEW_TYPE.M) {
      const startOfMonth = moment(startDate).add(-1, 'months').startOf('month');
      const endOfMonth = moment(startDate).add(-1, 'months').endOf('month');
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
    if (type === VIEW_TYPE.W) {
      const lastSunday = moment(startDate).add(-1, 'weeks');
      const currentSunday = moment(startDate).add(-1, 'weeks').weekday(7);
      setStartDate(lastSunday);
      setEndDate(currentSunday);
    }
  };

  const onNextClick = () => {
    if (type === VIEW_TYPE.M) {
      const startOfMonth = moment(startDate).add(1, 'months').startOf('month');
      const endOfMonth = moment(startDate).add(1, 'months').endOf('month');
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
    if (type === VIEW_TYPE.W) {
      const nextSunday = moment(startDate).add(1, 'weeks');
      const currentSunday = moment(startDate).add(1, 'weeks').weekday(7);
      setStartDate(nextSunday);
      setEndDate(currentSunday);
    }
  };

  const onDatePickerChange = (dates = []) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  const handleClearFilter = () => {
    dispatch({
      type: 'timeSheet/clearFilter',
    });
  };

  // MAIN AREA
  const applied = Object.values(filterFinance).filter((v) => v).length;
  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
        <CustomRangePicker
          startDate={startDate}
          endDate={endDate}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          onChange={onDatePickerChange}
          disabled
        />
      </div>
      <div className={styles.Header__middle}>{viewChangeComponent()}</div>
      <div className={styles.Header__right}>
        <FilterCountTag count={applied} onClearFilter={handleClearFilter} />

        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent type={type} />
            </Suspense>
          }
          realTime
        >
          <CustomOrangeButton showDot={applied > 0} />
        </FilterPopover>
        <SearchBar onChangeSearch={onChangeSearch} activeView={activeView} />
      </div>
    </div>
  );
};

export default connect(({ timeSheet }) => ({ timeSheet }))(Header);
