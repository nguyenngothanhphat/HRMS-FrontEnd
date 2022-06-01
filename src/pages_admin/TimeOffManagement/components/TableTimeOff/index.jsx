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
      title: 'Count/Q.ty',
      dataIndex: 'duration',
      width: '10%',
      align: 'center',
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
      selectedRowKeys: [],
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
    this.setState({ selectedRowKeys });
  };

  render() {
    const { listTimeOff = [], loading } = this.props;
    const { pageSelected, selectedRowKeys, rowSize } = this.state;

    return (
      <div className={styles.TableTimeOff}>
        <CommonTable
          loading={loading}
          selectedRowKeys={selectedRowKeys}
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
