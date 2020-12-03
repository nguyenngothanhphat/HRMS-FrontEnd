import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip } from 'antd';
import moment from 'moment';
import styles from './index.less';

export default class DataTable extends PureComponent {
  columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      align: 'left',
      render: () => <span>ID</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'left',
      render: (type) => <span>{type ? type.shortType : ''}</span>,
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Leave date',
      width: '20%',
      dataIndex: 'leaveTimes',
      align: 'left',
    },
    {
      title: `Req’ted on `,
      dataIndex: 'onDate',
      align: 'left',
      render: (onDate) => <span>{moment(onDate).locale('en').format('MM.DD.YYYY')}</span>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'left',
    },
    {
      title: 'Assigned',
      align: 'left',
      dataIndex: 'assigned',
      render: (assigned) => {
        return (
          <div className={styles.rowAction}>
            <Avatar.Group
              maxCount={2}
              maxStyle={{
                color: '#d6dce0',
                backgroundColor: '#d6dce0',
              }}
            >
              {assigned.map((user) => {
                const { generalInfo: { firstName = '', lastName = '', avatar = '' } = {} } = user;
                return (
                  <Tooltip title={`${firstName} ${lastName}`} placement="top">
                    <Avatar
                      style={{
                        backgroundColor: '#FFA100',
                      }}
                      src={avatar}
                    />
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          </div>
        );
      },
    },
    {
      title: 'Action',
      align: 'left',
      render: (key) => (
        <div className={styles.rowAction}>
          <span onClick={() => this.viewRequest(key)}>View Request</span>
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

  // view request
  viewRequest = (key) => {
    // eslint-disable-next-line no-alert
    alert('View Requests');
    // eslint-disable-next-line no-console
    console.log('key', key);
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

  onSelectChange = (selectedRowKeys) => {
    // eslint-disable-next-line no-console
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  processData = (data) => {
    return data.map((value) => {
      const { fromDate = '', toDate = '', approvalManager = {}, cc = [] } = value;
      const leaveTimes = `${moment(fromDate).locale('en').format('MM.DD.YYYY')} - ${moment(toDate)
        .locale('en')
        .format('MM.DD.YYYY')}`;
      const getIdFromCC = cc.map((v) => v._id);
      const assigned = [...getIdFromCC, approvalManager];

      return {
        ...value,
        leaveTimes,
        assigned,
      };
    });
  };

  render() {
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys } = this.state;
    const rowSize = 20;

    const parsedData = this.processData(data);
    // const scroll = {
    //   x: '',
    //   y: 'max-content',
    // };
    const pagination = {
      position: ['bottomRight'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          total
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
      <div className={styles.DataTable}>
        <Table
          size="small"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.columns}
          dataSource={parsedData}
          // scroll={scroll}
          rowKey="ticketId"
        />
      </div>
    );
  }
}
