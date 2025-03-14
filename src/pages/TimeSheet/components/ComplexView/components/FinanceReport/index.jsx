import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI, TAB_NAME, VIEW_TYPE } from '@/constants/timeSheet';
import ViewTypeSelector from '@/pages/TimeSheet/components/ComplexView/components/ViewTypeSelector';
import { getCurrentCompany } from '@/utils/authority';
import { generateAllWeeks } from '@/utils/timeSheet';
import Footer from './components/Footer';
import Header from './components/Header';
import MonthlyTable from './components/MonthlyTable';
import WeeklyTable from './components/WeeklyTable';
import styles from './index.less';

const FinanceReport = (props) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // weekly
  const [startDateWeek, setStartDateWeek] = useState('');
  const [endDateWeek, setEndDateWeek] = useState('');

  // monthly
  const [startDateMonth, setStartDateMonth] = useState('');
  const [endDateMonth, setEndDateMonth] = useState('');
  const [weeksOfMonth, setWeeksOfMonth] = useState([]);
  const [nameSearch, setNameSearch] = useState('');

  // others
  const [selectedView, setSelectedView] = useState(VIEW_TYPE.W); // D: daily, W: weekly, M: monthly
  const [selectedProjects, setSelectedProjects] = useState([]);

  const {
    dispatch,
    employee: { _id: employeeId = '' } = {},
    timeSheet: {
      financeViewList = [],
      financeViewListTotal = 0,
      selectedDivisions = [],
      selectedLocations = [],
      filterFinance = {},
    } = {},
    loadingFetch = false,
  } = props;

  // FUNCTION AREA
  const fetchFinanceTimesheet = (startDate, endDate) => {
    let payload = {};
    payload = {
      companyId: getCurrentCompany(),
      employeeId,
      fromDate: moment(startDate).format(dateFormatAPI),
      toDate: moment(endDate).format(dateFormatAPI),
      viewType: selectedView,
      selectedDivisions,
      selectedLocations,
      ...filterFinance,
    };
    if (nameSearch) {
      payload.search = nameSearch;
    }
    if (selectedView === VIEW_TYPE.W) {
      payload.page = page;
      payload.limit = limit;
    }

    dispatch({
      type: 'timeSheet/fetchFinanceTimesheetEffect',
      payload,
    });
  };

  const onChangePagination = (pageNumber, pageSizeTemp) => {
    setPage(pageNumber);
    setLimit(pageSizeTemp);
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (startDateWeek && selectedView === VIEW_TYPE.W) {
      fetchFinanceTimesheet(startDateWeek, endDateWeek);
    }
  }, [
    startDateWeek,
    selectedView,
    nameSearch,
    page,
    limit,
    JSON.stringify(selectedDivisions),
    JSON.stringify(selectedLocations),
    JSON.stringify(filterFinance),
  ]);

  useEffect(() => {
    if (startDateMonth && selectedView === VIEW_TYPE.M) {
      fetchFinanceTimesheet(startDateMonth, endDateMonth);
    }
  }, [
    startDateMonth,
    selectedView,
    nameSearch,
    JSON.stringify(selectedDivisions),
    JSON.stringify(selectedLocations),
    JSON.stringify(filterFinance),
  ]);

  useEffect(() => {
    setSelectedProjects([]);
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

  // RENDER UI
  const viewChangeComponent = () => (
    <ViewTypeSelector
      showDay={false}
      selectedView={selectedView}
      setSelectedView={setSelectedView}
    />
  );

  const onSearchDebounce = debounce((value) => {
    setNameSearch(value);
  }, 1000);

  const onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    onSearchDebounce(formatValue);
  };

  const renderHeader = () => {
    switch (selectedView) {
      case VIEW_TYPE.W:
        return (
          <Header
            startDate={startDateWeek}
            endDate={endDateWeek}
            onChangeSearch={onChangeSearch}
            setStartDate={setStartDateWeek}
            setEndDate={setEndDateWeek}
            viewChangeComponent={viewChangeComponent}
            type={VIEW_TYPE.W}
            activeView={TAB_NAME.FINANCE_REPORTS}
          />
        );

      case VIEW_TYPE.M:
        return (
          <Header
            startDate={startDateMonth}
            endDate={endDateMonth}
            onChangeSearch={onChangeSearch}
            setStartDate={setStartDateMonth}
            setEndDate={setEndDateMonth}
            viewChangeComponent={viewChangeComponent}
            type={VIEW_TYPE.M}
            activeView={TAB_NAME.FINANCE_REPORTS}
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
            data={financeViewList}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
            loadingFetch={loadingFetch}
            onChangePagination={onChangePagination}
            page={page}
            limit={limit}
            total={financeViewListTotal}
          />
        );
      case VIEW_TYPE.M:
        return (
          <MonthlyTable
            startDate={startDateMonth}
            endDate={endDateMonth}
            weeksOfMonth={weeksOfMonth}
            data={financeViewList}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
            loadingFetch={loadingFetch}
          />
        );
      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (selectedProjects.length === 0) return null;
    return (
      <Footer
        selectedProjects={selectedProjects}
        data={financeViewList}
        weeksOfMonth={weeksOfMonth}
        selectedView={selectedView}
      />
    );
  };

  // MAIN AREA
  return (
    <div className={styles.FinanceReport}>
      {renderHeader()}
      {renderTable()}
      {renderFooter()}
    </div>
  );
};

export default connect(({ timeSheet, loading, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  timeSheet,
  loadingFetch: loading.effects['timeSheet/fetchFinanceTimesheetEffect'],
}))(FinanceReport);
