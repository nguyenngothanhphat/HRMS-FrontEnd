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
      dataIndex: 'employee',
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a._id.localeCompare(b._id),
      },
      render: (employee) => {
        const { employeeId = '', generalInfo: { employeeId: emplID = '' } = {} } = employee;
        return <span>{employeeId || emplID}</span>;
      },
    },
    {
      title: 'Full Name',
      dataIndex: 'employee',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) =>
          a.employee.generalInfo.firstName.localeCompare(b.employee.generalInfo.firstName),
      },
      render: (employee) => {
        const { generalInfo: { firstName = '', lastName = '' } = {} } = employee;
        return (
          <span>
            {firstName} {lastName}
          </span>
        );
      },
    },
    {
      title: 'From Date',
      dataIndex: 'fromDate',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => new Date(a.fromDate) - new Date(b.fromDate),
      },
      render: (fromDate) => {
        const formatedDate = moment(fromDate).format('MM.DD.YY');
        return <span>{formatedDate}</span>;
      },
    },
    {
      title: 'To Date',
      dataIndex: 'toDate',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => new Date(a.toDate) - new Date(b.toDate),
      },
      render: (toDate) => {
        const formatedDate = moment(toDate).format('MM.DD.YY');
        return <span>{formatedDate}</span>;
      },
    },
    {
      title: 'Count/Q.ty',
      dataIndex: 'country',
      width: '10%',
    },
    {
      title: 'Leave Type',
      dataIndex: 'type',
      render: (type) => {
        const { typeName = '' } = type;
        return <span>{typeName}</span>;
      },
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
        <div className={styles.documentAction} onClick={this.onClick}>
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

  handleRequestDetail = (id) => {
    const { handleRequestDetail } = this.props;
    return handleRequestDetail(id);
  };

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
    const { listTimeOff = [], loading, requestDetail } = this.props;
    const { pageSelected, selectedRowKeys } = this.state;
    const rowSize = 10;
    const scroll = {
      x: '',
      y: '',
    };
    // console.log('request detail', requestDetail);
    const pagination = {
      position: ['bottomLeft'],
      total: listTimeOff.length,
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
          pagination={{ ...pagination, total: listTimeOff.length }}
          columns={this.columns}
          dataSource={listTimeOff}
          scroll={scroll}
          rowKey="employeeId"
          onRow={(item) => {
            return {
              onClick: () => this.handleRequestDetail(item._id),
            };
          }}
        />
      </div>
    );
  }
}
export default TableTimeOff;
