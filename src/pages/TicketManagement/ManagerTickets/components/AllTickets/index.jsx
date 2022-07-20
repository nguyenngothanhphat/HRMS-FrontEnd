import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { debouncedChangeLocation } from '@/utils/ticketManagement';
import FilterCount from '../../../components/FilterCount/FilterCount';
import SearchTable from '../../../components/SearchTable';
import Summary from '../Summary';
import TableTickets from '../TableTickets';
import styles from './index.less';

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
    filter = [],
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
  }, [
    pageSelected,
    size,
    selectedFilterTab,
    nameSearch,
    JSON.stringify(selectedLocations),
    JSON.stringify(filter),
  ]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'ticketManagement/clearFilter',
      });
      setApplied(0);
      setIsFiltering(false);
    };
  }, []);

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
        selectedFilterTab={selectedFilterTab}
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
    ticketManagement: {
      selectedLocations = [],
      listOffAllTicket = [],
      totalStatus = [],
      filter = [],
    } = {},
  }) => ({
    listOffAllTicket,
    totalStatus,
    selectedLocations,
    filter,
    country,
    loadingFetchTicketList: loading.effects['ticketManagement/fetchListAllTicket'],
  }),
)(AllTicket);
