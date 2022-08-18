import { Tabs } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import SearchFilterBar from '../../../SearchFilterBar';
import TableTickets from '../TableTickets';
import OverallTotal from '../OverallTotal';
import styles from './index.less';
import useCancelToken from '@/utils/hooks';
import { debounceFetchData } from '@/utils/utils';

const MyTickets = (props) => {
  const {
    data = [],
    loading,
    loadingFilter,
    permissions = [],
    ticketManagement: {
      selectedLocations = [],
      totalList = [],
      totals = [],
      filter = [],
      total = 0,
    } = {},
    employee: {
      _id = '',
      departmentInfo: { _id: idDepart = '' },
      location: { headQuarterAddress: { country = {} } = {} } = {},
    } = {},
    dispatch,
    role = '',
  } = props;

  const dataTableEmployee = data.filter((item) => {
    return item.employee_assignee === _id;
  });
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

  const fetchData = () => {
    let payload = {
      status: [getStatus(activeKey)],
      employee_assignee: _id,
      permissions,
      page: pageSelected,
      limit: size,
      location: selectedLocations,
      country: country?._id,
      cancelToken: cancelToken(),
      ...filter,
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

  const fetchTotalList = () => {
    const payload = {
      employeeAssignee: _id,
      departmentAssign: idDepart,
      location: selectedLocations,
      country: country?._id,
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

  useEffect(() => {
    fetchTotalList();
    return () => {
      dispatch({
        type: 'ticketManagement/clearFilter',
      });
    };
  }, []);

  const getCount = (value) => {
    const find = totals.find((val) => val.status === value);
    return find?.total || 0;
  };

  const tabs = [
    {
      value: '1',
      title: 'Assigned',
      count: getCount('Assigned'),
    },
    {
      value: '2',
      title: 'In Progress',
      count: getCount('In Progress'),
    },
    {
      value: '3',
      title: 'Client Pending',
      count: getCount('Client Pending'),
    },
    {
      value: '4',
      title: 'Resolved',
      count: getCount('Resolved'),
    },
    {
      value: '5',
      title: 'Closed',
      count: getCount('Closed'),
    },
  ];

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

  return (
    <div className={styles.MyTickets}>
      <OverallTotal countData={totalList} />
      <div className={styles.container}>
        <Tabs
          activeKey={activeKey}
          onChange={(val) => setActiveKey(val)}
          tabBarExtraContent={renderOptions()}
          destroyInactiveTabPane
        >
          {tabs.map((item) => (
            <Tabs.TabPane tab={`${item.title} (${item.count})`} key={item.value}>
              <TableTickets
                data={dataTableEmployee}
                loading={loading || loadingFilter}
                page={pageSelected}
                size={size}
                onChangePage={getPageAndSize}
                total={total}
                role={role}
                refreshFetchData={fetchData}
                refreshFetchTotalList={fetchTotalList}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default connect(
  ({ loading, user: { currentUser: { employee = {} } = {} } = {}, ticketManagement }) => ({
    employee,
    ticketManagement,
    loading: loading.effects['ticketManagement/fetchTicketList'],
  }),
)(MyTickets);
