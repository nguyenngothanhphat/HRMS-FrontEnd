import React, { PureComponent } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { formatMessage, connect } from 'umi';
import styles from './index.less';

@connect(({ employeesManagement }) => ({
  employeesManagement,
}))
class TableCandidates extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this.setFirstPage();
    }
  }

  generateColumns = () => {
    const columns = [
      {
        title: 'Rookie Name',
        dataIndex: 'fullName',
        align: 'left',
        fixed: 'left',
        width: '15%',
        render: (fullName) => <span className={styles.fullName}>{fullName}</span>,
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => a.employeeId.slice(4, a.userId) - b.employeeId.slice(4, b.userId),
        // },
      },
      {
        title: 'Rookie ID',
        dataIndex: 'ticketID',
        align: 'left',
        className: `${styles.rookieId}`,
        width: '10%',
        // defaultSortOrder: 'ascend',
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => a.userId - b.userId,
        // },
      },

      {
        title: 'Joined date',
        dataIndex: 'updatedAt',
        align: 'left',
        render: (updatedAt) => (
          <span>{updatedAt ? moment(updatedAt).locale('en').format('MMM Do, YYYY') : ''}</span>
        ),
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => new Date(a.joinedDate) - new Date(b.joinedDate),
        // },
      },
      {
        title: 'Position',
        dataIndex: 'position',
        align: 'left',
        width: '17%',
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => a.email.localeCompare(b.email),
        // },
      },
      {
        title: 'Location',
        dataIndex: 'workLocation',
        align: 'left',
        render: (workLocation) => <span>{workLocation ? workLocation.name : ''}</span>,
      },
      {
        title: 'Status',
        dataIndex: 'processStatus',
        align: 'left',
      },
      {
        title: 'Action',
        dataIndex: '_id',
        align: 'center',
        render: () => <a>Action</a>,
      },
    ];
    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
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
      <div className={styles.TableCandidates}>
        <Table
          size="small"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.generateColumns()}
          dataSource={data}
          scroll={scroll}
          rowKey={(record) => record.ticketID}
        />
      </div>
    );
  }
}
export default TableCandidates;
