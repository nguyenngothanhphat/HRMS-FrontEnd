import React, { PureComponent } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { formatMessage, connect, history } from 'umi';
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

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidatesManagement/ClearFilter',
    });
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Rookie Name',
        dataIndex: 'nameAndId',
        align: 'left',
        fixed: 'left',
        width: '12%',
        render: (nameAndId) => (
          <span onClick={() => this.viewCandidate(nameAndId.ticketID)} className={styles.fullName}>
            {nameAndId
              ? `${nameAndId.firstName} ${nameAndId.lastName} ${nameAndId.middleName}`
              : ''}
          </span>
        ),
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
      },

      {
        title: 'Private email',
        dataIndex: 'privateEmail',
        align: 'left',
        render: (privateEmail) => <span>{privateEmail || ''}</span>,
        width: '20%',
      },

      {
        title: 'Joined date',
        dataIndex: 'updatedAt',
        align: 'left',
        render: (updatedAt) => (
          <span>{updatedAt ? moment(updatedAt).locale('en').format('MM.DD.YY') : ''}</span>
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
        width: '12%',
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
        dataIndex: 'ticketID',
        align: 'center',
        render: (ticketID) => <a onClick={() => this.viewCandidate(ticketID)}>View</a>,
      },
    ];
    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  viewCandidate = (rookieId) => {
    history.push(`/candidates-management/candidate-detail/${rookieId}`);
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
    this.setState({ selectedRowKeys });
  };

  getData = () => {
    const { data = [] } = this.props;
    return data.map((value) => {
      return {
        ...value,
        nameAndId: {
          firstName: value.firstName,
          middleName: value.middleName,
          lastName: value.lastName,
          ticketID: value.ticketID,
        },
      };
    });
  };

  render() {
    const { loading, data = [] } = this.props;
    const { pageSelected, selectedRowKeys } = this.state;
    const rowSize = 10;
    const newData = this.getData();
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
          size="middle"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.generateColumns()}
          dataSource={newData}
          scroll={scroll}
          rowKey={(record) => record.ticketID}
        />
      </div>
    );
  }
}
export default TableCandidates;
