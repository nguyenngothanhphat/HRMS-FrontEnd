import React, { useState, useEffect } from 'react';

import { connect } from 'umi';
import { debounce } from 'lodash';

import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import styles from './index.less';
import FilterCount from '../../../components/FilterCount/FilterCount';
import TicketInfo from '../TicketInfo';

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
  const [applied, setApplied] = useState(0);
  const [form, setForm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

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

  const handleFilterCounts = (values) => {
    const filteredObj = Object.entries(values).filter(
      ([, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
    setIsFiltering(true);
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
      setApplied(0);
      setIsFiltering(false);
    };
  }, []);

  return (
    <>
      <div>
        <TicketInfo tabName={tabName} countData={totalList} />
      </div>
      <div className={styles.containerTickets}>
        <div className={styles.tabTickets}>
          <FilterCount
            applied={applied}
            form={form}
            setApplied={() => setApplied(0)}
            setIsFiltering={() => setIsFiltering(false)}
          />
          <SearchTable
            onChangeSearch={onChangeSearch}
            handleFilterCounts={handleFilterCounts}
            setForm={setForm}
            isFiltering={isFiltering}
          />
        </div>
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
      </div>
    </>
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
