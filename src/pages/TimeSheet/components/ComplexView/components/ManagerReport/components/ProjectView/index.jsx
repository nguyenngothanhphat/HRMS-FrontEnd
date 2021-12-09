import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ViewTypeSelector from '@/pages/TimeSheet/components/ComplexView/components/ViewTypeSelector';
import { getCurrentCompany } from '@/utils/authority';
import { dateFormatAPI, VIEW_TYPE } from '@/utils/timeSheet';
import Header from './components/Header';
import MonthlyTable from './components/MonthlyTable';
import WeeklyTable from './components/WeeklyTable';
import styles from './index.less';

const ProjectView = (props) => {
  // weekly
  const [startDateWeek, setStartDateWeek] = useState('');
  const [endDateWeek, setEndDateWeek] = useState('');

  // monthly
  const [startDateMonth, setStartDateMonth] = useState('');
  const [endDateMonth, setEndDateMonth] = useState('');
  const [weeksOfMonth, setWeeksOfMonth] = useState([]);

  // others
  const [selectedView, setSelectedView] = useState(VIEW_TYPE.W); // W: weekly, M: monthly

  const [currentProject, setCurrentProject] = useState();

  const {
    dispatch,
    timeSheet: { projectList = [], managerProjectViewList = [] } = {},
    employee: { _id: userId = '' } = {},
  } = props;

  // FUNCTION AREA
  const fetchManagerTimesheetOfProjectView = (startDate, endDate) => {
    if (currentProject) {
      dispatch({
        type: 'timeSheet/fetchManagerTimesheetOfProjectViewEffect',
        payload: {
          companyId: getCurrentCompany(),
          userId,
          fromDate: moment(startDate).format(dateFormatAPI),
          toDate: moment(endDate).format(dateFormatAPI),
          viewType: selectedView,
          projectId: currentProject,
        },
      });
    }
  };

  const fetchProjectList = () => {
    dispatch({
      type: 'timeSheet/fetchProjectListEffect',
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    fetchProjectList();
  }, []);

  useEffect(() => {
    if (projectList.length > 0) {
      setCurrentProject(projectList[0].id);
    }
  }, [JSON.stringify(projectList)]);

  useEffect(() => {
    if (startDateWeek && selectedView === VIEW_TYPE.W) {
      fetchManagerTimesheetOfProjectView(startDateWeek, endDateWeek);
    }
  }, [startDateWeek, selectedView, currentProject]);

  useEffect(() => {
    if (startDateMonth && selectedView === VIEW_TYPE.M) {
      fetchManagerTimesheetOfProjectView(startDateMonth, endDateMonth);
    }
  }, [startDateMonth, selectedView, currentProject]);

  // generate dates for week
  useEffect(() => {
    const lastSunday = moment().weekday(1);
    const currentSunday = moment().weekday(7);
    setStartDateWeek(lastSunday);
    setEndDateWeek(currentSunday);
  }, []);

  // generate weeks for month
  const generateAllWeeks = (fromDate, toDate) => {
    const weeks = [];
    let fd = new Date(fromDate);
    const weekNo = moment(fromDate, 'YYYY-MM-DD').week();
    const td = new Date(toDate);
    while (fd.getTime() < td.getTime()) {
      // const weekNumber = getWeekInMonth(fd)
      const weekNumber = moment(fd).week() - weekNo + 1;
      const startWeek = moment(fd).startOf('week').toDate();
      const endWeek = moment(fd).endOf('week').toDate();
      const existed = weeks.find((x) => x.week === weekNumber);
      fd = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() + 1);
      if (!existed) {
        weeks.push({
          week: weekNumber,
          startDate: moment(startWeek).format('YYYY-MM-DD'),
          endDate: moment(endWeek).format('YYYY-MM-DD'),
        });
      }
    }
    return weeks;
  };

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
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
            projectList={projectList}
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
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
            projectList={projectList}
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
            data={managerProjectViewList}
          />
        );
      case VIEW_TYPE.M:
        return (
          <MonthlyTable
            startDate={startDateMonth}
            endDate={endDateMonth}
            weeksOfMonth={weeksOfMonth}
            data={managerProjectViewList}
          />
        );
      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (selectedView) {
      case VIEW_TYPE.W:
        return null;
      case VIEW_TYPE.M:
        return null;
      default:
        return null;
    }
  };

  // MAIN AREA
  return (
    <div className={styles.ProjectView}>
      {renderHeader()}
      {renderTable()}
      {renderFooter()}
    </div>
  );
};

export default connect(({ timeSheet, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  timeSheet,
}))(ProjectView);
