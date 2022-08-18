import { Tabs } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { debounceFetchData } from '@/utils/utils';
import useCancelToken from '@/utils/hooks';
import SearchFilterBar from '../../../SearchFilterBar';
import TableTickets from '../TableTickets';
import styles from './index.less';

const AllTickets = (props) => {
  const {
    dispatch,
    country = {},
    loadingFetchTicketList = false,
    permissions = [],
    role = '',
    ticketManagement: {
      selectedLocations = [],
      ticketList: data = [],
      totals = [],
      filter = {},
      total = 0,
    } = {},
  } = props;

  const { cancelToken, cancelRequest } = useCancelToken();
  const { cancelToken: cancelToken2, cancelRequest: cancelRequest2 } = useCancelToken();
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

  const fetchData = () => {
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
      type: 'ticketManagement/fetchTicketList',
      payload,
    });

    const totalPayload = {
      ...payload,
      cancelToken: cancelToken2(),
    };
    delete totalPayload.page;
    delete totalPayload.limit;

    dispatch({
      type: 'ticketManagement/fetchTotals',
      payload: totalPayload,
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
    debounceFetchData(fetchData);
    return () => {
      cancelRequest();
      cancelRequest2();
    };
  }, [
    pageSelected,
    size,
    activeKey,
    nameSearch,
    JSON.stringify(selectedLocations),
    JSON.stringify(filter),
  ]);

  useEffect(() => {
    setPageSelected(1);
  }, [activeKey, nameSearch, JSON.stringify(filter), JSON.stringify(selectedLocations)]);

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
    const find = totals.find((val) => val.status === value);
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
              total={total}
              getPageAndSize={getPageAndSize}
              refreshData={fetchData}
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
    ticketManagement,
  }) => ({
    ticketManagement,
    country,
    loadingFetchTicketList: loading.effects['ticketManagement/fetchTicketList'],
  }),
)(AllTickets);
