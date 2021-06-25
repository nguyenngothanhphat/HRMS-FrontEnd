import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage, Link } from 'umi';
import moment from 'moment';
import styles from './index.less';

class TableOffBoarding extends PureComponent {
  columns = [
    {
      title: 'No.',
      key: 'index',
      width: '5%',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Ticket ID',
      dataIndex: 'ticketID',
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (ticketID) => {
        return <span>{ticketID}</span>;
      },
    },
    {
      title: 'User ID',
      dataIndex: 'employee',
      render: (employee) => {
        const { generalInfo: { employeeId = '' } = {} } = employee;
        return <span>{employeeId}</span>;
      },
    },
    {
      title: 'Full Name',
      dataIndex: 'employee',
      render: (employee) => {
        const { generalInfo: { legalName = '' } = {} } = employee;
        return <span>{legalName}</span>;
      },
    },
    {
      title: 'Group',
      dataIndex: 'group',
      render: () => <span>Group</span>,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'createdAt',
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (createdAt) => {
        const formatedDate = moment(createdAt).format('MM.DD.YY');
        return <span>{formatedDate}</span>;
      },
      sorter: {
        compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Last Working Date',
      dataIndex: 'lastWorkingDate',
      // sortDirections: ['ascend', 'descend', 'ascend'],
      render: (lastWorkingDate) => {
        const formatedDate = moment(lastWorkingDate).format('MM.DD.YY');
        return <span>{formatedDate}</span>;
      },
      // sorter: {
      //   compare: (a, b) => new Date(a.lastWorkingDate) - new Date(b.lastWorkingDate),
      // },
    },

    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      render: () => (
        <div className={styles.documentAction}>
          <Link>View Request</Link>
        </div>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
    };
  }

  // pagination
  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  setFirstPage = () => {
    this.setState({
      pageSelected: 1,
    });
  };

  // onSortChange = (pagination, filters, sorter, extra) => {
  //   console.log('params', pagination, filters, sorter, extra);
  // };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys } = this.state;
    const rowSize = 10;
    const scroll = {
      x: '',
      y: '',
    };
    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.TableOffBoarding}>
        <Table
          size="middle"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.columns}
          dataSource={data}
          scroll={scroll}
          rowKey={(record) => record.ticketNo}
        />
      </div>
    );
  }
}
export default TableOffBoarding;
