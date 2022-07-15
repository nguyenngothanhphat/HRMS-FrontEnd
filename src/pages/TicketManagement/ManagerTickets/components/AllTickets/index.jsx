import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import FilterCount from '../../../components/FilterCount/FilterCount';
import styles from './index.less';
import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import Summary from '../Summary';
import { debouncedChangeLocation } from '@/utils/ticketManagement';

const AllTicket = (props) => {
  const {
    dispatch,
    country = '',
    loadingFetchTicketList = false,
    listOffAllTicket: data = [],
    totalStatus = [],
    selectedLocations = [],
    permissions = [],
    role = '',
  } = props;

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
        return 'New';
      case '2':
        return 'Assigned';
      case '3':
        return 'In Progress';
      case '4':
        return 'Client Pending';
      case '5':
        return 'Resolved';
      case '6':
        return 'Closed';

      default:
        return 'New';
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
    debouncedChangeLocation(initDataTable);
    return () => {
      setApplied(0);
      setIsFiltering(false);
      dispatch({
        type: 'ticketManagement/clearFilter',
      });
    };
  }, [pageSelected, size, selectedFilterTab, nameSearch, JSON.stringify(selectedLocations)]);

  return (
    <div className={styles.containerTickets}>
      <div className={styles.tabTickets}>
        <Summary setSelectedTab={setSelectedTab} totalStatus={totalStatus} />
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
            className={styles.searchTable}
            handleFilterCounts={handleFilterCounts}
            setForm={setForm}
            isFiltering={isFiltering}
            selectedFilterTab={selectedFilterTab}
          />
        </div>
      </div>
      <TableTickets
        data={data}
        role={role}
        loading={loadingFetchTicketList}
        pageSelected={pageSelected}
        size={size}
        getPageAndSize={getPageAndSize}
        refreshFetchTicketList={initDataTable}
      />
    </div>
  );
};

export default connect(
  ({
    loading = {},
    user: {
      currentUser: {
        employee: { location: { headQuarterAddress: { country = '' } = {} } = {} } = {},
      } = {},
    },
    ticketManagement: { selectedLocations = [], listOffAllTicket = [], totalStatus = [] } = {},
  }) => ({
    listOffAllTicket,
    totalStatus,
    selectedLocations,
    country,
    loadingFetchTicketList: loading.effects['ticketManagement/fetchListAllTicket'],
  }),
)(AllTicket);
