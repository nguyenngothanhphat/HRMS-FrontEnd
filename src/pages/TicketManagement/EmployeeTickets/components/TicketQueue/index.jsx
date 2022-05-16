import React, { useState, useEffect } from 'react';

import { connect } from 'umi';
import { debounce } from 'lodash';

import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import TicketInfo from '../TicketInfo';

import styles from './index.less';
import { getAuthority } from '@/utils/authority';

const TicketQueue = (props) => {
  const {
    dispatch,
    data = [],
    loading,
    loadingFilter,
    countData = [],
    selectedLocations = [],
    employee: {
      _id = '',
      departmentInfo: { _id: idDepart = '' },
      location: { headQuarterAddress: { country = '' } = {} } = {},
    } = {},
  } = props;

  const [pageSelected, setPageSelected] = useState(1);
  const [size, setSize] = useState(10);
  const [nameSearch, setNameSearch] = useState('');

  const setDebounce = debounce((value) => {
    setNameSearch(value);
  }, 500);

  const initDataTable = (nameSearchProps, selectedLocationsProps = []) => {
    const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));

    let payload = {
      status: ['New'],
      page: pageSelected,
      limit: size,
      location: selectedLocationsProps,
    };
    if (nameSearchProps) {
      payload = {
        ...payload,
        search: nameSearchProps,
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
    const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));
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
    initDataTable(nameSearch, selectedLocations);
    fetchTotalList();
  }, [pageSelected, size, nameSearch, JSON.stringify(selectedLocations)]);

  return (
    <>
      <div>
        <TicketInfo countData={countData} />
      </div>
      <div className={styles.containerTickets}>
        <div className={styles.tabTickets}>
          <SearchTable onChangeSearch={onChangeSearch} />
        </div>
        <TableTickets
          data={data}
          loading={loading || loadingFilter}
          pageSelected={pageSelected}
          size={size}
          getPageAndSize={getPageAndSize}
          refreshFetchData={initDataTable}
          refreshFetchTotalList={fetchTotalList}
        />
      </div>
    </>
  );
};

export default connect(
  ({
    loading,
    ticketManagement: { listDepartment = [], selectedLocations = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
  }) => ({
    listDepartment,
    employee,
    selectedLocations,
    loading: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFilter: loading.effects['ticketManagement/fetchListAllTicketSearch'],
  }),
)(TicketQueue);
