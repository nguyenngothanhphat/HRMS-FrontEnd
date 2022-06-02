import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import styles from './index.less';
import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import TicketInfo from '../TicketInfo';
import Summary from '../Summary';
import FilterCount from '../../../components/FilterCount/FilterCount';

const MyTickets = (props) => {
  const {
    data = [],
    loading,
    loadingFilter,
    countData = [],
    permissions = [],
    selectedLocations = [],
    employee: {
      _id = '',
      departmentInfo: { _id: idDepart = '' },
      location: { headQuarterAddress: { country = '' } = {} } = {},
    } = {},
    dispatch,
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
      permissions,
      page: pageSelected,
      limit: size,
      location: selectedLocations,
      country,
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
      permissions,
      country,
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
    setIsFiltering(true);
  };

  useEffect(() => {
    initDataTable();
    return () => {
      setApplied(0);
      setIsFiltering(false);
      dispatch({
        type: 'ticketManagement/clearFilter',
      });
    };
  }, [pageSelected, size, selectedFilterTab, nameSearch, JSON.stringify(selectedLocations)]);

  useEffect(() => {
    fetchTotalList();
  }, [nameSearch, JSON.stringify(selectedLocations)]);

  return (
    <>
      <div>
        <TicketInfo countData={countData} />
      </div>
      <div className={styles.containerTickets}>
        <div className={styles.tabTickets}>
          <Summary setSelectedTab={setSelectedTab} countData={countData} />
          <div className={styles.filterTable}>
            <FilterCount
              applied={applied}
              form={form}
              setApplied={() => setApplied(0)}
              setIsFiltering={() => setIsFiltering(false)}
              initDataTable={initDataTable}
              selectedFilterTab={selectedFilterTab}
              nameSearch={nameSearch}
              selectedLocations={selectedLocations}
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
        />
      </div>
    </>
  );
};

export default connect(
  ({
    loading,
    user: { currentUser: { employee = {} } = {} } = {},

    ticketManagement: { selectedLocations = [] } = {},
  }) => ({
    employee,
    selectedLocations,
    loading: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFilter: loading.effects['ticketManagement/fetchListAllTicketSearch'],
  }),
)(MyTickets);
