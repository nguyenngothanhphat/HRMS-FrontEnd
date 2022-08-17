import { Card } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import SearchFilterBar from '../../../SearchFilterBar';
import TableTickets from '../TableTickets';
import OverallTotal from '../OverallTotal';
import styles from './index.less';
import useCancelToken from '@/utils/hooks';
import { debounceFetchData } from '@/utils/utils';

const TicketQueue = (props) => {
  const {
    dispatch,
    data = [],
    loading,
    loadingFilter,
    employee: {
      _id = '',
      departmentInfo: { _id: idDepart = '' },
      location: { headQuarterAddress: { country = {} } = {} } = {},
    } = {},
    role = '',
    permissions = [],
    tabName = '',
    ticketManagement: { selectedLocations = [], totalList = [], filter = [], total = 0 } = {},
  } = props;

  const { cancelToken, cancelRequest } = useCancelToken();
  const [pageSelected, setPageSelected] = useState(1);
  const [size, setSize] = useState(10);
  const [nameSearch, setNameSearch] = useState('');

  const setDebounce = debounce((value) => {
    setNameSearch(value);
  }, 500);

  const fetchData = () => {
    let payload = {
      status: ['New'],
      page: pageSelected,
      limit: size,
      location: selectedLocations,
      cancelToken: cancelToken(),
      ...filter,
    };
    if (nameSearch) {
      payload = {
        ...payload,
        search: nameSearch,
      };
    }
    if (permissions && permissions.length > 0) {
      payload = {
        ...payload,
        permissions,
        country: country?._id,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchTicketList',
      payload,
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
    setDebounce(formatValue);
  };

  useEffect(() => {
    debounceFetchData(fetchData);
    return () => {
      cancelRequest();
    };
  }, [pageSelected, size, nameSearch, JSON.stringify(selectedLocations), JSON.stringify(filter)]);

  useEffect(() => {
    fetchTotalList();
    return () => {
      dispatch({
        type: 'ticketManagement/clearFilter',
      });
    };
  }, []);

  const renderOptions = () => {
    return (
      <div className={styles.options}>
        <SearchFilterBar onChangeSearch={onChangeSearch} setPageSelected={setPageSelected} />
      </div>
    );
  };

  return (
    <div className={styles.TicketQueue}>
      <OverallTotal tabName={tabName} countData={totalList} />
      <Card title={null} extra={renderOptions()}>
        <TableTickets
          data={data}
          loading={loading || loadingFilter}
          page={pageSelected}
          size={size}
          onChangePage={getPageAndSize}
          refreshFetchData={fetchData}
          refreshFetchTotalList={fetchTotalList}
          role={role}
          total={total}
        />
      </Card>
    </div>
  );
};

export default connect(
  ({ loading, ticketManagement = {}, user: { currentUser: { employee = {} } = {} } = {} }) => ({
    ticketManagement,
    employee,
    loading: loading.effects['ticketManagement/fetchTicketList'],
  }),
)(TicketQueue);
