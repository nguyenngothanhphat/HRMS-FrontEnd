import React, { useEffect, useState } from 'react';
import filterIcon from '@/assets/offboarding-filter.svg';
import { Table } from 'antd';
import { formatMessage, connect, history } from 'umi';
import styles from '../../index.less';

const TicketResult = React.memo((props) => {
  const {
    keySearch,
    loadTableData,
    dispatch,
    isSearch,
    ticketAdvance,
    isSearchAdvance,
    ticketList,
    totalTickets,
    loadTableData2,
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    if (isSearch) {
      if (isSearchAdvance) {
        dispatch({
          type: 'searchAdvance/searchTicket',
          payload: { ...ticketAdvance },
        });
      } else if (keySearch) {
        dispatch({
          type: 'searchAdvance/searchGlobalByType',
          payload: {
            keySearch,
            searchType: 'TICKET',
          },
        });
      }
    }
  }, [isSearch]);

  const clickFilter = () => {
    history.push('tickets/advanced-search');
  };
  const onClickTicket = (record) => {
    const { id = '', title = '' } = record;
    let path = '';
    switch (title) {
      case 'Offboarding Request':
        path = `/offboarding/list/review/${id}`;
        break;
      case 'Leave Request':
      case 'Compoff Request':
        path = `/time-off/overview/manager-timeoff/view/${id}`;
        break;
      case 'Onboarding Ticket':
        path = `/onboarding/list/view/${id}`;
        break;
      default:
        break;
    }
    history.push(path);
  };
  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketID',
      key: 'ticketId',
      width: 200,
      render: (ticketID, record) => (
        <div className={styles.blueText} onClick={() => onClickTicket(record)}>
          {ticketID}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title) => <div>{title}</div>,
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      width: 300,
      render: (employee) => {
        if (employee) {
          const {
            generalInfo: { legalName, firstName = '', middleName = '', lastName = '' } = {},
          } = employee;
          const fullName = legalName || `${firstName} ${middleName} ${lastName}`;
          return <div className={styles.blueText}>{fullName}</div>;
        }
        return <div>-</div>;
      },
    },
    {
      title: 'Assignee To',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 300,
      render: (assignee) => {
        if (assignee) {
          const {
            generalInfo: { legalName, firstName = '', middleName = '', lastName = '' } = {},
          } = assignee;
          const fullName = legalName || `${firstName} ${middleName} ${lastName}`;
          return <div className={styles.blueText}>{fullName}</div>;
        }
        return <div>-</div>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <div>{status}</div>,
    },
  ];

  const pagination = {
    position: ['bottomLeft'],
    total: totalTickets,
    showTotal: (total, range) => (
      <span>
        {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
      </span>
    ),
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    pageSize: limit,
    current: page,
    onChange: (nextPage, pageSize) => {
      setPage(nextPage);
      setLimit(pageSize);
    },
  };
  return (
    <div className={styles.resultContent}>
      <div className={styles.filter}>
        <img src={filterIcon} alt="filter icon" onClick={clickFilter} />
      </div>
      <div className={styles.result}>
        <Table
          columns={columns}
          dataSource={ticketList}
          size="middle"
          pagination={pagination}
          loading={loadTableData || loadTableData2}
        />
      </div>
    </div>
  );
});
export default connect(
  ({
    loading,
    searchAdvance: {
      keySearch = '',
      isSearch,
      isSearchAdvance,
      ticketAdvance,
      globalSearchAdvance: { tickets: ticketList, totalTickets },
    },
  }) => ({
    loadTableData: loading.effects['searchAdvance/searchTicket'],
    loadTableData2: loading.effects['searchAdvance/searchGlobalByType'],
    ticketList,
    totalTickets,
    ticketAdvance,
    isSearch,
    isSearchAdvance,
    keySearch,
  }),
)(TicketResult);
