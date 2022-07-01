import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
import { Button, Skeleton, Tag, Tooltip } from 'antd';
import { connect } from 'umi';
import { CloseOutlined } from '@ant-design/icons';
import exportToCSV from '@/utils/exportAsExcel';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import IconWarning from '@/assets/timeSheet/ic_warning.svg';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import SearchBar from '@/pages/TimeSheet/components/ComplexView/components/SearchBar';
import { checkHolidayInWeek, dateFormatAPI, holidayFormatDate, VIEW_TYPE } from '@/utils/timeSheet';
import styles from './index.less';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import FilterContent from './components/FilterContent';
import { getCurrentCompany } from '@/utils/authority';

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
    timeSheet: { holidays = [] },
  } = props;

  const {
    user: {
      currentUser: {
        employee,
        location: { headQuarterAddress: { country: { _id: countryID } = {} } = {} } = {},
      } = {},
    } = {},
  } = props;
  const [applied, setApplied] = useState(0);
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
    exportToCSV(processData(data), 'HumanResourceReportData.xlsx');
  };

  const handleClearFilter = () => {
    dispatch({
      type: 'timeSheet/clearFilter',
    });
    setApplied(0);
    form?.resetFields();
  };

  const fetchMyTimesheetEffectByType = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId: employee._id,
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
        viewType: VIEW_TYPE.W,
      },
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (startDate && endDate) fetchMyTimesheetEffectByType();
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
                      ? `${holidayFormatDate(holiday.date)} is ${holiday.holidayName}`
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
        <div className={styles.downloadIcon} onClick={downloadTemplate}>
          <img src={DownloadIcon} alt="Icon Download" />
          <Button>Download</Button>
        </div>
        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent setForm={setForm} setApplied={setApplied} />
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

export default connect(({ user, user: { currentUser: { employee = {} } = {} }, timeSheet }) => ({
  user,
  employee,
  timeSheet,
}))(Header);
