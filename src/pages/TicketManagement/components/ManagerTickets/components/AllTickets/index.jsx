import { Tabs } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { debouncedChangeLocation } from '@/utils/ticketManagement';
import useCancelToken from '@/utils/hooks';
import SearchFilterBar from '../../../SearchFilterBar';
import TableTickets from '../TableTickets';
import styles from './index.less';

const AllTickets = (props) => {
  const {
    dispatch,
    country = {},
    loadingFetchTicketList = false,
    listOffAllTicket: data = [],
    totalStatus = [],
    selectedLocations = [],
    permissions = [],
    role = '',
    filter = {},
  } = props;

  const { cancelToken, cancelRequest } = useCancelToken();
  const [pageSelected, setPageSelected] = useState(1);
  const [size, setSize] = useState(10);
  const [nameSearch, setNameSearch] = useState('');
  const [activeKey, setActiveKey] = useState('1');

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
      status: [getStatus(activeKey)],
      permissions,
      page: pageSelected,
      limit: size,
      location: selectedLocations,
      country: country?._id,
      ...filter,
      cancelToken: cancelToken(),
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

  const getPageAndSize = (page, pageSize) => {
    setPageSelected(page);
    setSize(pageSize);
  };

  const onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    onSearchDebounce(formatValue);
  };

  useEffect(() => {
    debouncedChangeLocation(initDataTable);
    return () => {
      cancelRequest();
    };
  }, [
    pageSelected,
    size,
    activeKey,
    nameSearch,
    JSON.stringify(selectedLocations),
    JSON.stringify(filter),
  ]);

  const renderOptions = () => {
    return (
      <div className={styles.options}>
        <SearchFilterBar
          onChangeSearch={onChangeSearch}
          className={styles.searchTable}
          selectedFilterTab={activeKey}
          setPageSelected={setPageSelected}
        />
      </div>
    );
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
    },
    {
      value: '2',
      title: 'Assigned',
      count: getCount('Assigned'),
    },
    {
      value: '3',
      title: 'In Progress',
      count: getCount('In Progress'),
    },
    {
      value: '4',
      title: 'Client Pending',
      count: getCount('Client Pending'),
    },
    {
      value: '5',
      title: 'Resolved',
      count: getCount('Resolved'),
    },
    {
      value: '6',
      title: 'Closed',
      count: getCount('Closed'),
    },
  ];

  return (
    <div className={styles.AllTickets}>
      <Tabs
        activeKey={activeKey}
        onChange={(val) => setActiveKey(val)}
        tabBarExtraContent={renderOptions()}
        destroyInactiveTabPane
      >
        {tabs.map((item) => (
          <Tabs.TabPane tab={`${item.title} (${item.count})`} key={item.value}>
            <TableTickets
              data={data}
              role={role}
              loading={loadingFetchTicketList}
              pageSelected={pageSelected}
              size={size}
              total={item.count}
              getPageAndSize={getPageAndSize}
              refreshFetchTicketList={initDataTable}
              selectedFilterTab={activeKey}
            />
          </Tabs.TabPane>
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
        employee: { location: { headQuarterAddress: { country = {} } = {} } = {} } = {},
      } = {},
    },
    ticketManagement: {
      selectedLocations = [],
      listOffAllTicket = [],
      totalStatus = [],
      filter = {},
    } = {},
  }) => ({
    listOffAllTicket,
    totalStatus,
    selectedLocations,
    filter,
    country,
    loadingFetchTicketList: loading.effects['ticketManagement/fetchListAllTicket'],
  }),
)(AllTickets);
