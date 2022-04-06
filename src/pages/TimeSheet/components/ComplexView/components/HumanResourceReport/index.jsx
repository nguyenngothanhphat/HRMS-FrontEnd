import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { dateFormatAPI, VIEW_TYPE, TAB_NAME, generateAllWeeks } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import Header from './components/Header';
import Footer from './components/Footer';
import ViewTypeSelector from '@/pages/TimeSheet/components/ComplexView/components/ViewTypeSelector';
import WeeklyTable from './components/WeeklyTable';
import styles from './index.less';

const HumanResourceReport = (props) => {
  // weekly
  const [startDateWeek, setStartDateWeek] = useState('');
  const [endDateWeek, setEndDateWeek] = useState('');

  // monthly
  const [startDateMonth, setStartDateMonth] = useState('');
  const [endDateMonth, setEndDateMonth] = useState('');
  const [weeksOfMonth, setWeeksOfMonth] = useState([]);

  // nameSearch
  const [nameSearch, setNameSearch] = useState('');
  // others
  const [selectedView, setSelectedView] = useState(VIEW_TYPE.W); // D: daily, W: weekly, M: monthly
  const [selectedEmployees, setSelectedEmployees] = useState([]); // D: daily, W: weekly, M: monthly
  const {
    dispatch,
    timeSheet: { hrViewList = [], filterHrView = {} } = {},
    loadingFetch = false,
  } = props;

  // FUNCTION AREA
  const fetchHRTimesheet = (startDate, endDate) => {
    let payload = {};
    payload = {
      companyId: getCurrentCompany(),
      // employeeId,
      fromDate: moment(startDate).format(dateFormatAPI),
      toDate: moment(endDate).format(dateFormatAPI),
      ...filterHrView,
    };

    if (nameSearch) {
      payload.search = nameSearch;
    }
    dispatch({
      type: 'timeSheet/fetchHRTimesheetEffect',
      payload,
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (startDateWeek && selectedView === VIEW_TYPE.W) {
      fetchHRTimesheet(startDateWeek, endDateWeek);
    }
  }, [startDateWeek, endDateWeek, selectedView, nameSearch, JSON.stringify(filterHrView)]);

  useEffect(() => {
    if (startDateMonth && selectedView === VIEW_TYPE.M) {
      fetchHRTimesheet(startDateMonth, endDateMonth);
    }
  }, [startDateMonth, endDateMonth, selectedView, nameSearch, JSON.stringify(filterHrView)]);

  useEffect(() => {
    setSelectedEmployees([]);
  }, [selectedView]);

  // generate dates for week
  useEffect(() => {
    const lastSunday = moment().weekday(1);
    const currentSunday = moment().weekday(7);
    setStartDateWeek(lastSunday);
    setEndDateWeek(currentSunday);
  }, []);

  // get current month
  useEffect(() => {
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    setStartDateMonth(startOfMonth);
    setEndDateMonth(endOfMonth);
  }, []);

  // refresh the week list when the month changed
  useEffect(() => {
    const weeks = generateAllWeeks(startDateMonth, endDateMonth);
    setWeeksOfMonth(weeks);
  }, [startDateMonth]);

  const onSearchDebounce = debounce((value) => {
    setNameSearch(value);
  }, 1000);

  const onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    onSearchDebounce(formatValue);
  };

  // RENDER UI
  const viewChangeComponent = () => (
    <ViewTypeSelector
      showDay={false}
      selectedView={selectedView}
      setSelectedView={setSelectedView}
    />
  );

  const renderHeader = () => {
    switch (selectedView) {
      case VIEW_TYPE.W:
        return (
          <Header
            startDate={startDateWeek}
            endDate={endDateWeek}
            data={hrViewList}
            setStartDate={setStartDateWeek}
            setEndDate={setEndDateWeek}
            viewChangeComponent={viewChangeComponent}
            type={VIEW_TYPE.W}
            onChangeSearch={onChangeSearch}
            activeView={TAB_NAME.HR_REPORTS}
          />
        );

      case VIEW_TYPE.M:
        return (
          <Header
            startDate={startDateMonth}
            endDate={endDateMonth}
            data={hrViewList}
            setStartDate={setStartDateMonth}
            setEndDate={setEndDateMonth}
            viewChangeComponent={viewChangeComponent}
            onChangeSearch={onChangeSearch}
            type={VIEW_TYPE.M}
            activeView={TAB_NAME.HR_REPORTS}
          />
        );

      default:
        return null;
    }
  };

  const renderTable = () => {
    switch (selectedView) {
      case VIEW_TYPE.W:
        return (
          <WeeklyTable
            startDate={startDateWeek}
            endDate={endDateWeek}
            data={hrViewList}
            selectedEmployees={selectedEmployees}
            setSelectedEmployees={setSelectedEmployees}
            loadingFetch={loadingFetch}
          />
        );
      case VIEW_TYPE.M:
        return (
          <WeeklyTable
            startDate={startDateMonth}
            endDate={endDateMonth}
            weeksOfMonth={weeksOfMonth}
            data={hrViewList}
            selectedEmployees={selectedEmployees}
            setSelectedEmployees={setSelectedEmployees}
            loadingFetch={loadingFetch}
          />
        );
      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (selectedEmployees.length === 0) return null;
    return <Footer selectedEmployees={selectedEmployees} data={hrViewList} />;
  };
  // MAIN AREA
  return (
    <div className={styles.HumanResourceReport}>
      {renderHeader()}
      {renderTable()}
      {renderFooter()}
    </div>
  );
};

export default connect(({ timeSheet, loading, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  timeSheet,
  loadingFetch: loading.effects['timeSheet/fetchHRTimesheetEffect'],
}))(HumanResourceReport);
