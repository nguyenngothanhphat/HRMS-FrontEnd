import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip } from 'antd';

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
      title: `Req’ted on `,
      dataIndex: 'onDate',
      align: 'left',
    },
    {
      title: 'Leave date',
      width: '20%',
      dataIndex: 'leaveDate',
      align: 'left',
      // render: <span>Leave date</span>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'left',
    },
    {
      title: 'Assigned',
      align: 'left',
      render: (key) => {
        const { assigned = [] } = key;
        return (
          <div className={styles.rowAction}>
            <Avatar.Group
              maxCount={2}
              maxStyle={{
                color: '#d6dce0',
                backgroundColor: '#d6dce0',
              }}
            >
              {assigned.map((value) => {
                return (
                  <Tooltip title={value.name} placement="top">
                    <Avatar
                      style={{
                        backgroundColor: '#FFA100',
                      }}
                      src={value.imageUrl}
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

  render() {
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys } = this.state;
    const rowSize = 20;
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
          dataSource={data}
          // scroll={scroll}
          rowKey="ticketId"
        />
      </div>
    );
  }
}
