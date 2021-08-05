import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage, Link, history } from 'umi';
import moment from 'moment';
import { getCurrentPage, setCurrentPage, removeCurrentPage } from '@/utils/timeoffManagement';
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
      // defaultSortOrder: 'ascend',
      // sortDirections: ['ascend', 'descend', 'ascend'],
      // sorter: {
      //   compare: (a, b) => a._id.localeCompare(b._id),
      // },
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
          a.employee?.generalInfo?.firstName.localeCompare(b.employee?.generalInfo?.firstName),
      },
      render: (employee) => {
        const { generalInfo: { firstName = '', lastName = '' } = {} } = employee || {};
        return (
          <span>
            {firstName} {lastName}
          </span>
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
        const formatedDate = fromDate ? moment(fromDate).format('MM.DD.YY') : '';
        return <span>{formatedDate}</span>;
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
        const formatedDate = toDate ? moment(toDate).format('MM.DD.YY') : '';
        return <span>{formatedDate}</span>;
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
        <div className={styles.documentAction} onClick={() => this.onViewClick(_id)}>
          <Link>View Request</Link>
        </div>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageSelected: getCurrentPage() || 1,
      selectedRowKeys: [],
    };
  }

  componentDidUpdate = (prevProps) => {
    const { listTimeOff = [] } = this.props;
    if (JSON.stringify(listTimeOff) !== JSON.stringify(prevProps.listTimeOff)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        pageSelected: 1,
      });
    }
  };

  componentWillUnmount = () => {
    window.addEventListener('beforeunload', () => {
      removeCurrentPage();
    });
  };

  onViewClick = (_id) => {
    history.push(`/time-off/overview/manager-timeoff/view/${_id}`);
  };

  handleRequestDetail = (id) => {
    const { handleRequestDetail } = this.props;
    return handleRequestDetail(id);
  };

  // pagination
  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
    setCurrentPage(pageNumber);
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
    const { listTimeOff = [], loading } = this.props;
    const { pageSelected, selectedRowKeys } = this.state;
    const rowSize = 10;
    const scroll = {
      x: '',
      y: '',
    };

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
          size="middle"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: listTimeOff.length }}
          columns={this.columns}
          dataSource={listTimeOff}
          scroll={scroll}
          rowKey={(record) => record._id}
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
