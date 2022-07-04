import moment from 'moment';
import React, { Suspense, useState } from 'react';
import { connect } from 'umi';
import { Skeleton, Tag, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import SearchBar from '@/pages/TimeSheet/components/ComplexView/components/SearchBar';
import styles from './index.less';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import FilterContent from './components/FilterContent';
import IconWarning from '@/assets/timeSheet/ic_warning.svg';
import { checkHolidayInWeek, holidayFormatDate } from '@/utils/timeSheet';

const Header = (props) => {
  const {
    dispatch,
    startDate,
    endDate,
    setStartDate = () => {},
    setEndDate = () => {},
    onChangeSearch = () => {},
    activeView = '',
    holidays = [],
  } = props;

  const [applied, setApplied] = useState(0);
  const [form, setForm] = useState(null);

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
    setApplied(0);
    form?.resetFields();
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
        {isHoliday && (
          <Tooltip
            title={
              <span style={{ margin: 0, color: '#F98E2C' }}>
                {holidays.map((holiday) => (
                  <div key={holiday.date}>
                    {checkHolidayInWeek(startDate, endDate, [holiday])
                      ? `${holidayFormatDate(holiday.date)} is ${holiday.holidayName}`
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
        {applied > 0 && (
          <Tag
            className={styles.Header__tagCountFilter}
            closable
            closeIcon={<CloseOutlined onClick={handleClearFilter} />}
          >
            {applied} filters applied
          </Tag>
        )}
        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent setApplied={setApplied} setForm={setForm} />
            </Suspense>
          }
          realTime
        >
          <FilterButton />
        </FilterPopover>
        <SearchBar onChangeSearch={onChangeSearch} activeView={activeView} />
      </div>
    </div>
  );
};

export default connect(() => ({}))(Header);
