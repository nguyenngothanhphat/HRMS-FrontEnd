import { Card } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import SearchFilterBar from '../../../SearchFilterBar';
import TableTickets from '../TableTickets';
import OverallTotal from '../OverallTotal';
import styles from './index.less';

const TicketQueue = (props) => {
  const {
    dispatch,
    data = [],
    loading,
    loadingFilter,
    totalList = [],
    selectedLocations = [],
    employee: {
      _id = '',
      departmentInfo: { _id: idDepart = '' },
      location: { headQuarterAddress: { country = '' } = {} } = {},
    } = {},
    role = '',
    permissions = [],
    tabName = '',
    filter = '',
  } = props;

  const [pageSelected, setPageSelected] = useState(1);
  const [size, setSize] = useState(10);
  const [nameSearch, setNameSearch] = useState('');

  const setDebounce = debounce((value) => {
    setNameSearch(value);
  }, 500);

  const initDataTable = () => {
    let payload = {
      status: ['New'],
      page: pageSelected,
      limit: size,
      location: selectedLocations,
      ...filter,
    };
    if (nameSearch) {
      payload = {
        ...payload,
        search: nameSearch,
      };
    }
    if (permissions && permissions.length > 0) {
      payload = {
        ...payload,
        permissions,
        country,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload,
    });
  };

  const fetchTotalList = () => {
    const payload = {
      employeeAssignee: _id,
      departmentAssign: idDepart,
      location: selectedLocations,
      country,
      permissions,
    };
    dispatch({
      type: 'ticketManagement/fetchToTalList',
      payload,
    });
  };

  const getPageAndSize = (page, pageSize) => {
    setPageSelected(page);
    setSize(pageSize);
  };

  const onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    setDebounce(formatValue);
  };

  useEffect(() => {
    initDataTable();
  }, [pageSelected, size, nameSearch, JSON.stringify(selectedLocations), JSON.stringify(filter)]);

  useEffect(() => {
    fetchTotalList();
    return () => {
      dispatch({
        type: 'ticketManagement/clearFilter',
      });
    };
  }, []);

  const renderOptions = () => {
    return (
      <div className={styles.options}>
        <SearchFilterBar onChangeSearch={onChangeSearch} setPageSelected={setPageSelected} />
      </div>
    );
  };

  return (
    <div className={styles.TicketQueue}>
      <OverallTotal tabName={tabName} countData={totalList} />
      <Card title={null} extra={renderOptions()}>
        <TableTickets
          data={data}
          loading={loading || loadingFilter}
          pageSelected={pageSelected}
          size={size}
          getPageAndSize={getPageAndSize}
          refreshFetchData={initDataTable}
          refreshFetchTotalList={fetchTotalList}
          role={role}
        />
      </Card>
    </div>
  );
};

export default connect(
  ({
    loading,
    ticketManagement: {
      listDepartment = [],
      selectedLocations = [],
      totalList = [],
      filter = [],
    } = {},
    user: { currentUser: { employee = {} } = {} } = {},
  }) => ({
    listDepartment,
    employee,
    totalList,
    filter,
    selectedLocations,
    loading: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFilter: loading.effects['ticketManagement/fetchListAllTicketSearch'],
  }),
)(TicketQueue);
