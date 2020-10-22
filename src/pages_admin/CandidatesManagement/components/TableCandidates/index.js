import React, { PureComponent } from 'react';
import { Table } from 'antd';
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

  generateColumns = () => {
    const columns = [
      {
        title: 'Rookie ID',
        dataIndex: 'rookieId',
        align: 'left',
        width: '10%',
        // defaultSortOrder: 'ascend',
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => a.userId - b.userId,
        // },
      },
      {
        title: 'Rookie Name',
        dataIndex: 'rookieName',
        align: 'left',
        width: '20%',
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => a.employeeId.slice(4, a.userId) - b.employeeId.slice(4, b.userId),
        // },
      },
      {
        title: 'Joined date',
        dataIndex: 'joinedDate',
        align: 'left',
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
        dataIndex: 'location',
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
          rowKey="rookieId"
        />
      </div>
    );
  }
}
export default TableCandidates;
