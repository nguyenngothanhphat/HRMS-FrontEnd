import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage, Link } from 'umi';
import moment from 'moment';
import styles from './index.less';

class TableTimeOff extends PureComponent {
  columns = [
    {
      title: 'No.',
      key: 'index',
      width: '5%',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.employeeId.localeCompare(b.employeeId),
      },
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      // sortDirections: ['ascend', 'descend', 'ascend'],
      // sorter: {
      //   compare: (a, b) => a.employeeGroup.localeCompare(b.employeeGroup),
      // },
    },
    {
      title: 'From Date',
      dataIndex: 'fromDate',
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (fromDate) => {
        const formatedDate = moment(fromDate).format('MM/DD/YYYY');
        return <span>{formatedDate}</span>;
      },
      sorter: {
        compare: (a, b) => new Date(a.fromDate) - new Date(b.fromDate),
      },
    },
    {
      title: 'To Date',
      dataIndex: 'toDate',
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (toDate) => {
        const formatedDate = moment(toDate).format('MM/DD/YYYY');
        return <span>{formatedDate}</span>;
      },
      sorter: {
        compare: (a, b) => new Date(a.toDate) - new Date(b.toDate),
      },
    },
    {
      title: 'Count/Q.ty',
      dataIndex: 'count',
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
    },
    {
      title: 'Status',
      dataIndex: 'status',
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
    // eslint-disable-next-line no-console
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys } = this.state;
    const rowSize = 10;
    const scroll = {
      x: '100vw',
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
      <div className={styles.TableTimeOff}>
        <Table
          size="small"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.columns}
          dataSource={data}
          scroll={scroll}
          rowKey="employeeId"
        />
      </div>
    );
  }
}
export default TableTimeOff;
