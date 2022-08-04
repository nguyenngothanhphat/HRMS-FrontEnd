import { Skeleton, Tooltip } from 'antd';
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'umi';
import IconWarning from '@/assets/timeSheet/ic_warning.svg';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { dateFormatAPI } from '@/constants/timeSheet';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import SearchBar from '@/pages/TimeSheet/components/ComplexView/components/SearchBar';
import { getCurrentCompany } from '@/utils/authority';
import { checkHolidayInWeek, holidayFormatDate } from '@/utils/timeSheet';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const Header = (props) => {
  const {
    dispatch,
    startDate,
    endDate,
    setStartDate = () => {},
    setEndDate = () => {},
    onChangeSearch = () => {},
    activeView = '',
    timeSheet: { filterManagerReport = {} } = {},
  } = props;

  const [holidays, setHolidays] = useState([]);

  const isHoliday = checkHolidayInWeek(startDate, endDate, holidays);

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

  const handleClearFilter = () => {
    dispatch({
      type: 'timeSheet/clearFilter',
    });
  };

  const fetchHolidaysByDate = async () => {
    const holidaysResponse = await dispatch({
      type: 'timeSheet/fetchHolidaysByDate',
      payload: {
        companyId: getCurrentCompany(),
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
      },
    });
    setHolidays(holidaysResponse);
  };

  useEffect(() => {
    if (startDate && endDate) fetchHolidaysByDate();
  }, [startDate, endDate]);

  const applied = Object.values(filterManagerReport).filter((v) => v).length;

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
        {isHoliday && (
          <Tooltip
            title={
              <span style={{ margin: 0, color: '#F98E2C' }}>
                {holidays.map((holiday) => (
                  <div key={holiday.date}>
                    {checkHolidayInWeek(startDate, endDate, [holiday])
                      ? `${holidayFormatDate(holiday.date)} is ${holiday.holiday}`
                      : null}
                  </div>
                ))}
              </span>
            }
            placement="top"
            color="#FFFAF2"
          >
            <img src={IconWarning} alt="" />
          </Tooltip>
        )}
      </div>
      <div className={styles.Header__right}>
        <FilterCountTag count={applied} onClearFilter={handleClearFilter} />
        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent />
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
