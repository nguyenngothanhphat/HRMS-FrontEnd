import { Skeleton, Tooltip } from 'antd';
import moment from 'moment';
import React, { Suspense, useState } from 'react';
import { connect } from 'umi';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import IconWarning from '@/assets/timeSheet/ic_warning.svg';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { VIEW_TYPE } from '@/constants/timeSheet';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import SearchBar from '@/pages/TimeSheet/components/ComplexView/components/SearchBar';
import { exportArrayDataToCsv } from '@/utils/exportToCsv';
import { checkHolidayInWeek, holidayFormatDate } from '@/utils/timeSheet';
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
    data = [],
    activeView = '',
    dispatch,
  } = props;

  const {
    user: {
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID } = {} } = {} } = {},
      } = {},
    } = {},
    timeSheet: { filterHrView = {} },
    holidays = [],
  } = props;
  const [form, setForm] = useState(null);

  const locationUser = countryID === 'US';

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

  const processData = (array) => {
    // Uppercase first letter
    let capsPopulations = [];
    capsPopulations = array.map((item) => {
      const {
        legalName = '',
        leaveTaken = '',
        employeeCode = '',
        projects = [],
        userSpentInDay = 0,
        userSpentInHours = 0,
        incompleteDates = [],
        // totalLeave = '',
        // totalWorkingDay = '',
        // totalWorkingDayInHours = '',
        overTime = '',
        breakTime = '',
        department: { name = '' } = {},
      } = item;

      let projectName = '';
      projects.forEach((el, index) => {
        projectName += el;
        if (index + 1 < projects.length) projectName += ', ';
      });
      let incompleteTimeSheetDates = '';
      incompleteDates.forEach((el, index) => {
        const { date = '' } = el;
        incompleteTimeSheetDates += date;
        if (index + 1 < incompleteDates.length) incompleteTimeSheetDates += ', ';
      });

      const payload = {
        Employee: legalName,
        'Employee ID': employeeCode,
        Department: name,
        Project: projectName,
        'Working Days': `${userSpentInDay} hours)`,
        'Leave Taken': leaveTaken,
        'Total Hours': `${userSpentInHours} hours`,
        'Incomplete TimeSheet Dates': incompleteTimeSheetDates,
      };
      if (locationUser) {
        payload['Break Time'] = breakTime;
        payload['Over Time'] = overTime;
      }

      return payload;
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('__')}`.split('__');
      dataExport.push(value);
    });

    return dataExport;
  };

  const downloadTemplate = () => {
    exportArrayDataToCsv('HRReportData', processData(data));
  };

  const handleClearFilter = () => {
    dispatch({
      type: 'timeSheet/clearFilter',
    });
    form?.resetFields();
  };

  const isHoliday = checkHolidayInWeek(startDate, endDate, holidays);
  const applied = Object.values(filterHrView).filter((v) => v).length;

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
        {isHoliday ? (
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
            <img src={IconWarning} alt="" style={{ marginRight: 8 }} />
          </Tooltip>
        ) : null}
      </div>

      <div className={styles.Header__middle}>{viewChangeComponent()}</div>

      <div className={styles.Header__right}>
        <FilterCountTag count={applied} onClearFilter={handleClearFilter} />
        <CustomOrangeButton onClick={downloadTemplate} icon={DownloadIcon}>
          Download
        </CustomOrangeButton>

        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent setForm={setForm} />
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

export default connect(({ user, user: { currentUser: { employee = {} } = {} }, timeSheet }) => ({
  user,
  employee,
  timeSheet,
}))(Header);
