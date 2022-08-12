import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI, VIEW_TYPE } from '@/constants/timeSheet';
import ViewTypeSelector from '@/pages/TimeSheet/components/ComplexView/components/ViewTypeSelector';
import { getCurrentCompany } from '@/utils/authority';
import useCancelToken from '@/utils/hooks';
import { generateAllWeeks } from '@/utils/timeSheet';
import { debounceFetchData } from '@/utils/utils';
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

  // nameSearch
  const [nameSearch, setNameSearch] = useState('');

  // others
  const [selectedView, setSelectedView] = useState(VIEW_TYPE.W); // W: weekly, M: monthly
  const { cancelToken, cancelRequest } = useCancelToken();
  const { cancelToken: cancelToken2, cancelRequest: cancelRequest2 } = useCancelToken();
  const [currentProject, setCurrentProject] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [holidays, setHolidays] = useState([]);

  const {
    dispatch,
    permissions = {},
    timeSheet: {
      projectList = [],
      managerProjectViewList = [],
      managerProjectViewPagination = {},
    } = {},
    employee: { _id: userId = '', departmentInfo: { name: departmentName = '' } = {} } = {},
    loadingFetchProjectList = false,
    activeView = '',
  } = props;

  // FUNCTION AREA
  const fetchManagerTimesheetOfProjectView = async (startDate, endDate) => {
    let payload = {};
    payload = {
      companyId: getCurrentCompany(),
      userId,
      fromDate: moment(startDate).format(dateFormatAPI),
      toDate: moment(endDate).format(dateFormatAPI),
      viewType: selectedView,
      projectId: currentProject,
      page,
      limit,
      cancelToken: cancelToken(),
    };
    if (nameSearch) {
      payload.search = nameSearch;
    }

    if (currentProject) {
      dispatch({
        type: 'timeSheet/fetchManagerTimesheetOfProjectViewEffect',
        payload,
      });
      dispatch({
        type: 'timeSheet/savePayload',
        payload: {
          payloadExport: payload,
        },
      });

      const holidaysResponse = await dispatch({
        type: 'timeSheet/fetchHolidaysByDate',
        payload: {
          companyId: getCurrentCompany(),
          fromDate: moment(startDate).format(dateFormatAPI),
          toDate: moment(endDate).format(dateFormatAPI),
          cancelToken: cancelToken2(),
        },
      });
      setHolidays(holidaysResponse);
    }
  };
  // set permissions
  const projectViewDefault = permissions.viewReportProjectViewTimesheet === 1;
  const projectLocationView = permissions.viewReportProjectLocationViewTimesheet === 1;
  const projectAdminView = permissions.viewReportProjectAdminViewTimesheet === 1;

  const fetchProjectList = () => {
    if (projectAdminView) {
      dispatch({
        type: 'timeSheet/fetchProjectListEffect',
      });
      return;
    }
    if (projectLocationView) {
      dispatch({
        type: 'timeSheet/fetchProjectListEffect',
        payload: {
          departmentName,
        },
      });
      return;
    }
    if (projectViewDefault) {
      dispatch({
        type: 'timeSheet/fetchProjectListEffect',
        payload: {
          departmentName,
          userId,
        },
      });
    }
  };

  const onChangePage = (pageNumber) => {
    setPage(pageNumber);
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
      debounceFetchData(() => fetchManagerTimesheetOfProjectView(startDateWeek, endDateWeek));
      return () => {
        cancelRequest();
        cancelRequest2();
      };
    }
    return () => {};
  }, [startDateWeek, selectedView, currentProject, page, nameSearch]);

  useEffect(() => {
    if (startDateMonth && selectedView === VIEW_TYPE.M) {
      debounceFetchData(() => fetchManagerTimesheetOfProjectView(startDateMonth, endDateMonth));
      return () => {
        cancelRequest();
        cancelRequest2();
      };
    }
    return () => {};
  }, [startDateMonth, selectedView, currentProject, page, nameSearch]);

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
            setStartDate={setStartDateWeek}
            setEndDate={setEndDateWeek}
            viewChangeComponent={viewChangeComponent}
            type={VIEW_TYPE.W}
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
            projectList={projectList}
            onChangeSearch={onChangeSearch}
            loadingFetchProjectList={loadingFetchProjectList}
            activeView={activeView}
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
            onChangeSearch={onChangeSearch}
            loadingFetchProjectList={loadingFetchProjectList}
            activeView={activeView}
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
            tablePagination={managerProjectViewPagination}
            onChangePage={onChangePage}
            holidays={holidays}
          />
        );
      case VIEW_TYPE.M:
        return (
          <MonthlyTable
            startDate={startDateMonth}
            endDate={endDateMonth}
            weeksOfMonth={weeksOfMonth}
            data={managerProjectViewList}
            tablePagination={managerProjectViewPagination}
            onChangePage={onChangePage}
            holidays={holidays}
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

export default connect(
  ({ timeSheet, loading, user: { permissions = [], currentUser: { employee = {} } = {} } }) => ({
    employee,
    timeSheet,
    permissions,
    loadingFetchProjectList: loading.effects['timeSheet/fetchProjectListEffect'],
  }),
)(ProjectView);
