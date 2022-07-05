import moment from 'moment';
import React, { PureComponent } from 'react';
import { Link } from 'umi';
import CommonTable from '@/components/CommonTable';
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
      render: (employee) => {
        const { generalInfo: { employeeId = '' } = {} } = employee;
        return <span>{employeeId}</span>;
      },
    },
    {
      title: 'Full Name',
      dataIndex: 'employee',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) =>
          a.employee?.generalInfo?.legalName.localeCompare(b.employee?.generalInfo?.legalName),
      },
      render: (employee = {}) => {
        return (
          <Link
            to={`/directory/employee-profile/${employee.generalInfo?.userId}`}
            style={{
              fontWeight: 500,
            }}
          >
            {employee?.generalInfo?.legalName}
          </Link>
        );
      },
    },
    {
      title: 'Reporting Manager',
      dataIndex: 'approvalManager',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) =>
          a.approvalManager?.generalInfo?.legalName.localeCompare(
            b.approvalManager?.generalInfo?.legalName,
          ),
      },
      render: (approvalManager = {}) => {
        return (
          <Link
            to={`/directory/employee-profile/${approvalManager.generalInfo?.userId}`}
            style={{
              fontWeight: 500,
            }}
          >
            {approvalManager?.generalInfo?.legalName}
          </Link>
        );
      },
    },
    {
      title: 'Joining Date',
      align: 'center',
      dataIndex: 'employee',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
      },
      render: (employee = {}) => {
        return (
          <span>{employee?.joinDate ? moment(employee?.joinDate).format('MM/DD/YYYY') : ''}</span>
        );
      },
    },
    {
      title: 'From Date',
      align: 'center',
      dataIndex: 'fromDate',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => new Date(a.fromDate) - new Date(b.fromDate),
      },
      render: (fromDate) => {
        return <span>{fromDate ? moment(fromDate).format('MM/DD/YYYY') : ''}</span>;
      },
    },
    {
      title: 'To Date',
      align: 'center',
      dataIndex: 'toDate',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => new Date(a.toDate) - new Date(b.toDate),
      },
      render: (toDate) => {
        return <span>{toDate ? moment(toDate).format('MM/DD/YYYY') : ''}</span>;
      },
    },
    {
      title: 'Count (in days)',
      dataIndex: 'duration',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Leave Type',
      dataIndex: 'type',
      render: (type) => {
        const { name = '' } = type;
        return <span>{name}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      align: 'left',
      render: (_id) => (
        <div className={styles.documentAction}>
          <Link to={`/time-off/overview/manager-timeoff/view/${_id}`}>View Request</Link>
        </div>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      rowSize: 10,
    };
  }

  componentDidUpdate = (prevProps) => {
    const { listTimeOff = [] } = this.props;
    if (JSON.stringify(listTimeOff) !== JSON.stringify(prevProps.listTimeOff)) {
      this.setState({
        pageSelected: 1,
      });
    }
  };

  // pagination
  onChangePagination = (pageNumber, pageSize) => {
    this.setState({
      pageSelected: pageNumber,
      rowSize: pageSize,
    });
  };

  setFirstPage = () => {
    this.setState({
      pageSelected: 1,
    });
  };

  onSelectChange = (selectedRowKeys) => {
    const { setSelectedRows = () => {} } = this.props;
    setSelectedRows(selectedRowKeys);
  };

  render() {
    const { listTimeOff = [], loading, selectedRows = [] } = this.props;
    const { pageSelected, rowSize } = this.state;

    return (
      <div className={styles.TableTimeOff}>
        <CommonTable
          loading={loading}
          selectedRowKeys={selectedRows}
          setSelectedRowKeys={this.onSelectChange}
          columns={this.columns}
          list={listTimeOff}
          rowKey="_id"
          scrollable
          selectable
          page={pageSelected}
          limit={rowSize}
          onChangePage={this.onChangePagination}
        />
      </div>
    );
  }
}
export default TableTimeOff;
