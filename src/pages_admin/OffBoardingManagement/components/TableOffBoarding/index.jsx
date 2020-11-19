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
      title: 'Ticket No',
      dataIndex: 'ticketNo',
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.ticketNo.localeCompare(b.ticketNo),
      },
    },
    {
      title: 'User ID',
      width: '7%',
      dataIndex: 'userId',
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
      title: 'Group',
      dataIndex: 'group',
    },
    {
      title: 'Submitted Date',
      dataIndex: 'submittedDate',
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (submittedDate) => {
        const formatedDate = moment(submittedDate).format('MM/DD/YYYY');
        return <span>{formatedDate}</span>;
      },
      sorter: {
        compare: (a, b) => new Date(a.submittedDate) - new Date(b.submittedDate),
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Last Working Date',
      dataIndex: 'lastWorkingDate',
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (lastWorkingDate) => {
        const formatedDate = moment(lastWorkingDate).format('MM/DD/YYYY');
        return <span>{formatedDate}</span>;
      },
      sorter: {
        compare: (a, b) => new Date(a.lastWorkingDate) - new Date(b.lastWorkingDate),
      },
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
          size="small"
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
