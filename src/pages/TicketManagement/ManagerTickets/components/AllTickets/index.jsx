import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { Spin, Tabs } from 'antd';
import styles from './index.less';
import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';

const { TabPane } = Tabs;
const AllTicket = (props) => {
  const {
    dispatch,
    country = '',
    loadingFetchTicketList = false,
    loadingFetchTotalList = false,
    loadingFilter = false,
    listOffAllTicket: data = [],
    totalList: { totalStatus = [] } = [],
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
    const payload = {
      status: [getStatus(selectedFilterTab)],
      search: nameSearch,
      permissions,
      page: pageSelected,
      limit: size,
      location: selectedLocations,
      country,
    };
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

  const onChangeTab = (activeKey) => {
    setSelectedTab(activeKey);
  };

  const renderTab = (value) => {
    return <div>{value}</div>;
  };

  const getCount = (value) => {
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
            <Spin spinning={loadingFetchTicketList || loadingFetchTotalList || loadingFilter}>
              <TableTickets
                data={data}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={getPageAndSize}
                refreshFetchTicketList={initDataTable}
                refreshFetchTotalList={fetchTotalList}
              />
            </Spin>
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
    ticketManagement: { selectedLocations = [], listOffAllTicket = [], totalList = [] } = {},
  }) => ({
    listOffAllTicket,
    totalList,
    selectedLocations,
    country,
    loadingFetchTicketList: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFetchTotalList: loading.effects['ticketManagement/fetchToTalList'],
    loadingFilter: loading.effects['ticketManagement/fetchListAllTicketSearch'],
  }),
)(AllTicket);
