import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI, VIEW_TYPE, generateAllWeeks } from '@/utils/timeSheet';
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

  // others
  const [selectedView, setSelectedView] = useState(VIEW_TYPE.W); // D: daily, W: weekly, M: monthly
  const [selectedEmployees, setSelectedEmployees] = useState([]); // D: daily, W: weekly, M: monthly
  const { dispatch, timeSheet: { hrViewList = [] } = {}, loadingFetch = false } = props;

  // FUNCTION AREA
  const fetchHRTimesheet = (startDate, endDate) => {
    dispatch({
      type: 'timeSheet/fetchHRTimesheetEffect',
      payload: {
        companyId: getCurrentCompany(),
        // employeeId,
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
      },
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (startDateWeek && selectedView === VIEW_TYPE.W) {
      fetchHRTimesheet(startDateWeek, endDateWeek);
    }
  }, [startDateWeek, endDateWeek, selectedView]);

  useEffect(() => {
    if (startDateMonth && selectedView === VIEW_TYPE.M) {
      fetchHRTimesheet(startDateMonth, endDateMonth);
    }
  }, [startDateMonth, endDateMonth, selectedView]);

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
            setStartDate={setStartDateWeek}
            setEndDate={setEndDateWeek}
            viewChangeComponent={viewChangeComponent}
            type={VIEW_TYPE.W}
          />
        );

      case VIEW_TYPE.M:
        return (
          <Header
            startDate={startDateMonth}
            endDate={endDateMonth}
            setStartDate={setStartDateMonth}
            setEndDate={setEndDateMonth}
            viewChangeComponent={viewChangeComponent}
            type={VIEW_TYPE.M}
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
    return <Footer selectedEmployees={selectedEmployees} />;
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
