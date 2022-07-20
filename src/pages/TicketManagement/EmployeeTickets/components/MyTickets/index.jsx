import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import FilterCount from '../../../components/FilterCount/FilterCount';
import SearchTable from '../../../components/SearchTable';
import Summary from '../Summary';
import TableTickets from '../TableTickets';
import TicketInfo from '../TicketInfo';
import styles from './index.less';

const MyTickets = (props) => {
  const {
    data = [],
    loading,
    loadingFilter,
    totalStatus = [],
    totalList = [],
    permissions = [],
    selectedLocations = [],
    employee: {
      _id = '',
      departmentInfo: { _id: idDepart = '' },
      location: { headQuarterAddress: { country = '' } = {} } = {},
    } = {},
    dispatch,
    role = '',
    filter = [],
  } = props;

  const dataTableEmployee = data.filter((item) => {
    return item.employee_assignee === _id;
  });
  const [selectedFilterTab, setSelectedFilterTab] = useState('1');
  const [pageSelected, setPageSelected] = useState(1);
  const [size, setSize] = useState(10);
  const [nameSearch, setNameSearch] = useState('');
  const [applied, setApplied] = useState(0);
  const [form, setForm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const onSearchDebounce = debounce((value) => {
    setNameSearch(value);
  }, 500);

  const getStatus = (selectedTab) => {
    switch (selectedTab) {
      case '1':
        return 'Assigned';
      case '2':
        return 'In Progress';
      case '3':
        return 'Client Pending';
      case '4':
        return 'Resolved';
      case '5':
        return 'Closed';

      default:
        return 'Assigned';
    }
  };

  const initDataTable = () => {
    let payload = {
      status: [getStatus(selectedFilterTab)],
      employee_assignee: _id,
      permissions,
      page: pageSelected,
      limit: size,
      location: selectedLocations,
      country,
      ...filter,
    };
    if (nameSearch) {
      payload = {
        ...payload,
        search: nameSearch,
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

  const setSelectedTab = (id) => {
    setSelectedFilterTab(id);
  };

  const getPageAndSize = (page, pageSize) => {
    setPageSelected(page);
    setSize(pageSize);
  };

  const onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    onSearchDebounce(formatValue);
  };

  const handleFilterCounts = (values) => {
    const filteredObj = Object.entries(values).filter(
      ([, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
    setIsFiltering(Object.keys(newObj).length > 0);
  };

  useEffect(() => {
    initDataTable();
  }, [
    pageSelected,
    size,
    selectedFilterTab,
    nameSearch,
    JSON.stringify(selectedLocations),
    JSON.stringify(filter),
  ]);

  useEffect(() => {
    fetchTotalList();
    return () => {
      setApplied(0);
      setIsFiltering(false);
      dispatch({
        type: 'ticketManagement/clearFilter',
      });
    };
  }, []);

  return (
    <>
      <div>
        <TicketInfo countData={totalList} />
      </div>
      <div className={styles.containerTickets}>
        <div className={styles.tabTickets}>
          <Summary setSelectedTab={setSelectedTab} totalStatus={totalStatus} />
          <div className={styles.filterTable}>
            <FilterCount
              applied={applied}
              form={form}
              setApplied={() => setApplied(0)}
              setIsFiltering={() => setIsFiltering(false)}
              setPageSelected={setPageSelected}
            />
            <SearchTable
              onChangeSearch={onChangeSearch}
              handleFilterCounts={handleFilterCounts}
              setForm={setForm}
              isFiltering={isFiltering}
              selectedFilterTab={selectedFilterTab}
            />
          </div>
        </div>
        <TableTickets
          data={dataTableEmployee}
          loading={loading || loadingFilter}
          pageSelected={pageSelected}
          size={size}
          getPageAndSize={getPageAndSize}
          role={role}
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
    user: { currentUser: { employee = {} } = {} } = {},

    ticketManagement: { selectedLocations = [], totalList = [], filter = [] } = {},
  }) => ({
    employee,
    totalList,
    filter,
    selectedLocations,
    loading: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFilter: loading.effects['ticketManagement/fetchListAllTicketSearch'],
  }),
)(MyTickets);
