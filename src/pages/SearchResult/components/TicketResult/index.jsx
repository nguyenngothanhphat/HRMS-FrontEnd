import React, { useEffect, useState } from 'react';
import filterIcon from '@/assets/offboarding-filter.svg';
import { Table } from 'antd';
import { formatMessage, connect, history } from 'umi';
import styles from '../../index.less';

const TicketResult = (props) => {
  const {
    keySearch,
    loadTableData,
    dispatch,
    isSearch,
    ticketAdvance,
    ticketList,
    totalTickets,
    loadTableData2,
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    if (isSearch) {
      if (keySearch) {
        dispatch({
          type: 'searchAdvance/searchGlobalByType',
          payload: {
            keySearch,
            searchType: 'TICKET',
          },
        });
      } else {
        dispatch({
          type: 'searchAdvance/searchTicket',
          payload: { ...ticketAdvance },
        });
      }
    }
  }, [isSearch]);

  const clickFilter = () => {
    history.push('tickets/advanced-search');
  };

  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketID',
      key: 'ticketId',
      render: (ticketID) => <div className={styles.blueText}>{ticketID}</div>,
    },
    {
      title: 'Type',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <div>{title}</div>,
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
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
      // dispatch({
      //   type: 'searchAdvance/save',
      //   payload: { isSearch: true },
      // });
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
};
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
