import { CloseOutlined } from '@ant-design/icons';
import { Skeleton, Tag, Tooltip } from 'antd';
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'umi';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import IconWarning from '@/assets/timeSheet/ic_warning.svg';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import FilterPopover from '@/components/FilterPopover';
import { dateFormatAPI, VIEW_TYPE } from '@/constants/timeSheet';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import SearchBar from '@/pages/TimeSheet/components/ComplexView/components/SearchBar';
import { getCurrentCompany } from '@/utils/authority';
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
  } = props;
  const [applied, setApplied] = useState(0);
  const [holidays, setHolidays] = useState([]);
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

  const processData = (array = []) => {
    return array.map((item) => {
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
      const dataExport = {
        Employee: legalName,
        'Employee ID': employeeCode,
        Department: name,
        Project: projectName,
        'Working Days': `${userSpentInDay} hours)`,
        'Leave Taken ': leaveTaken,
        'Total Hours': `${userSpentInHours} hours`,
        'Incomplete TimeSheet Dates': incompleteTimeSheetDates,
      };
      if (locationUser) {
        dataExport['Break Time'] = breakTime;
        dataExport['Over Time'] = overTime;
      }
      return dataExport;
    });
  };

  const downloadTemplate = () => {
    exportArrayDataToCsv('HRReportData', processData(data));
  };

  const handleClearFilter = () => {
    dispatch({
      type: 'timeSheet/clearFilter',
    });
    setApplied(0);
    form?.resetFields();
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

  // USE EFFECT AREA
  useEffect(() => {
    if (startDate && endDate) fetchHolidaysByDate();
  }, [startDate, endDate]);

  const isHoliday = checkHolidayInWeek(startDate, endDate, holidays);

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
        {applied > 0 && (
          <Tag
            className={styles.Header__tagCountFilter}
            closable
            closeIcon={<CloseOutlined onClick={handleClearFilter} />}
          >
            {applied} filters applied
          </Tag>
        )}
        <CustomOrangeButton onClick={downloadTemplate} icon={DownloadIcon}>
          Download
        </CustomOrangeButton>

        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent setForm={setForm} setApplied={setApplied} />
            </Suspense>
          }
          realTime
        >
          <CustomOrangeButton />
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
