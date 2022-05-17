import React, { useState, useEffect } from 'react';

import { connect } from 'umi';
import { debounce } from 'lodash';

import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import styles from './index.less';
import FilterCount from '../../../components/FilterCount/FilterCount';
import { getAuthority } from '@/utils/authority';
import TicketInfo from '../TicketInfo';

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
  const [applied, setApplied] = useState(0);
  const [form, setForm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

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

  const handleFilterCounts = (values) => {
    const filteredObj = Object.entries(values).filter(
      ([key, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
    setIsFiltering(true);
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
