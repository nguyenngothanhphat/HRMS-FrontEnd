import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { Tabs } from 'antd';
import styles from './index.less';
import Summary from '../Summary';
import SearchTable from '../../../components/SearchTable';
import { getAuthority } from '@/utils/authority';
import TableTickets from '../TableTickets';

const { TabPane } = Tabs;
const AllTicket = (props) => {
  const {
    dispatch,
    country = '',
    data = [],
    loading,
    loadingFilter,
    countData = [],
    selectedLocations = [],
    refreshFetchTicketList = () => {},
    refreshFetchTotalList = () => {},
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

  const initDataTable = (tabId, nameSearchProps, selectedLocationsProps = []) => {
    const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));
    let payload = {
      status: [getStatus(tabId)],
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
    let payload = {
      status: [getStatus(selectedFilterTab)],
      location: selectedLocations,
    };
    if (permissions && permissions.length > 0) {
      payload = {
        ...payload,
        permissions,
        country,
      };
    }
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
    initDataTable(selectedFilterTab, nameSearch, selectedLocations);
    fetchTotalList();
  }, [pageSelected, size, selectedFilterTab, nameSearch, JSON.stringify(selectedLocations)]);

  // return (
  //   <div className={styles.containerTickets}>
  //     <div className={styles.tabTickets}>
  //       <Summary setSelectedTab={setSelectedTab} countData={countData} />
  //       <SearchTable onChangeSearch={onChangeSearch} className={styles.searchTable} />
  //     </div>
  //     <TableTickets
  //       data={data}
  //       loading={loading || loadingFilter}
  //       pageSelected={pageSelected}
  //       size={size}
  //       getPageAndSize={getPageAndSize}
  //       refreshFetchTicketList={refreshFetchTicketList}
  //       refreshFetchTotalList={refreshFetchTotalList}
  //     />
  //   </div>
  // );

  const onChangeTab = (activeKey) => {
    setSelectedTab(activeKey);
  };

  const renderTab = (value) => {
    return <div>{value}</div>;
  };

  const getCount = (value) => {
    const { countData: { totalStatus = [] } = {} } = props;
    const find = totalStatus.find((val) => val.status === value);
    return find?.total || 0;
  };

  const tabs = [
    {
      value: '1',
      title: 'New',
      count: getCount('New'),
      renderTab: renderTab('New'),
    },
    {
      value: '2',
      title: 'Assigned',
      count: getCount('Assigned'),
      renderTab: renderTab('Assigned'),
    },
    {
      value: '3',
      title: 'In Progress',
      count: getCount('In Progress'),
      renderTab: renderTab('In Progress'),
    },
    {
      value: '4',
      title: 'Client Pending',
      count: getCount('Client Pending'),
      renderTab: renderTab('Client Pending'),
    },
    {
      value: '5',
      title: 'Resolved',
      count: getCount('Resolved'),
      renderTab: renderTab('Resolved'),
    },
    {
      value: '6',
      title: 'Closed',
      count: getCount('Closed'),
      renderTab: renderTab('Closed'),
    },
  ];

  return (
    <div className={styles.containerTickets}>
      <Tabs
        defaultActiveKey="1"
        onChange={(activeKey) => onChangeTab(activeKey)}
        tabBarExtraContent={
          <SearchTable onChangeSearch={onChangeSearch} className={styles.searchTable} />
        }
      >
        {tabs.map((item) => (
          <TabPane tab={`${item.title} (${item.count})`} key={item.value}>
            <TableTickets
              data={data}
              loading={loading || loadingFilter}
              pageSelected={pageSelected}
              size={size}
              getPageAndSize={getPageAndSize}
              refreshFetchTicketList={refreshFetchTicketList}
              refreshFetchTotalList={refreshFetchTotalList}
            />
          </TabPane>
        ))}
      </Tabs>
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
    ticketManagement: { selectedLocations = [] } = {},
  }) => ({
    selectedLocations,
    country,
    loading: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFilter: loading.effects['ticketManagement/fetchListAllTicketSearch'],
  }),
)(AllTicket);
