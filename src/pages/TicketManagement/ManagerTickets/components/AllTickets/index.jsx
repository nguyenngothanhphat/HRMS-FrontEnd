import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import styles from './index.less';
import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import Summary from '../Summary';

const AllTicket = (props) => {
  const {
    dispatch,
    country = '',
    loadingFetchTicketList = false,
    loadingFetchTotalList = false,
    listOffAllTicket: data = [],
    totalList: countData = [],
    selectedLocations = [],
    permissions = [],
  } = props;

  const [selectedFilterTab, setSelectedFilterTab] = useState('1');
  const [pageSelected, setPageSelected] = useState(1);
  const [size, setSize] = useState(10);
  const [nameSearch, setNameSearch] = useState('');

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

  const fetchTotalList = () => {
    const payload = {
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

  useEffect(() => {
    initDataTable();
  }, [pageSelected, size, selectedFilterTab, nameSearch, JSON.stringify(selectedLocations)]);

  useEffect(() => {
    fetchTotalList();
  }, [nameSearch, JSON.stringify(selectedLocations)]);

  return (
    <div className={styles.containerTickets}>
      <div className={styles.tabTickets}>
        <Summary setSelectedTab={setSelectedTab} countData={countData} />
        <SearchTable onChangeSearch={onChangeSearch} className={styles.searchTable} />
      </div>
      <TableTickets
        data={data}
        loading={loadingFetchTicketList || loadingFetchTotalList}
        pageSelected={pageSelected}
        size={size}
        getPageAndSize={getPageAndSize}
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
    ticketManagement: { selectedLocations = [], listOffAllTicket = [], totalList = [] } = {},
  }) => ({
    listOffAllTicket,
    totalList,
    selectedLocations,
    country,
    loadingFetchTicketList: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFetchTotalList: loading.effects['ticketManagement/fetchToTalList'],
  }),
)(AllTicket);
