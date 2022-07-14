import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { Spin } from 'antd';
import { dateFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import Header from './components/Header';
import MemberTable from './components/MemberTable';
import Pagination from './components/Pagination';
import styles from './index.less';

const limit = 5;
const TeamView = (props) => {
  // weekly
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [nameSearch, setNameSearch] = useState('');

  const {
    dispatch,
    employee: { _id: employeeId = '' } = {},
    timeSheet: {
      managerTeamViewList = [],
      managerTeamViewPagination = {},
      filterManagerReport = {},
      payloadExport = {},
    } = {},
    loadingFetch = false,
    activeView = '',
  } = props;

  // FUNCTION AREA
  const fetchManagerTimesheetOfTeamView = () => {
    let payload = {};
    payload = {
      companyId: getCurrentCompany(),
      userId: employeeId,
      fromDate: moment(startDate).format(dateFormatAPI),
      toDate: moment(endDate).format(dateFormatAPI),
      page: nameSearch ? 1 : page,
      limit,
      ...filterManagerReport,
    };
    if (nameSearch) {
      payload.search = nameSearch;
    }
    dispatch({
      type: 'timeSheet/fetchManagerTimesheetOfTeamViewEffect',
      payload,
    });
    dispatch({
      type: 'timeSheet/savePayload',
      payload: {
        payloadExport: { ...payloadExport, payload },
      },
    });
  };

  const onChangePage = (pageNumber) => {
    setPage(pageNumber);
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (startDate) {
      fetchManagerTimesheetOfTeamView();
    }
  }, [startDate, endDate, page, nameSearch, JSON.stringify(filterManagerReport)]);

  // generate dates for week
  useEffect(() => {
    const lastSunday = moment().weekday(1);
    const currentSunday = moment().weekday(7);
    setStartDate(lastSunday);
    setEndDate(currentSunday);
  }, []);

  const onSearchDebounce = debounce((value) => {
    setNameSearch(value);
  }, 1000);

  const onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    onSearchDebounce(formatValue);
  };

  // MAIN AREA
  return (
    <div className={styles.TeamView}>
      <Header
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onChangeSearch={onChangeSearch}
        activeView={activeView}
      />
      <Spin spinning={loadingFetch}>
        <MemberTable data={managerTeamViewList} startDate={startDate} endDate={endDate} />
        <Pagination tablePagination={managerTeamViewPagination} onChangePage={onChangePage} />
      </Spin>
    </div>
  );
};

export default connect(({ loading, user: { currentUser: { employee = {} } = {} }, timeSheet }) => ({
  employee,
  loadingFetch: loading.effects['timeSheet/fetchManagerTimesheetOfTeamViewEffect'],
  timeSheet,
}))(TeamView);
