import React, { PureComponent } from 'react';
import { Table, Avatar, Divider, Tooltip } from 'antd';
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons';

import styles from './index.less';

export default class LRTable extends PureComponent {
  columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      align: 'center',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: `Req’ted on `,
      dataIndex: 'requestedOn',
      align: 'center',
    },
    {
      title: 'Leave date',
      width: '20%',
      dataIndex: 'leaveDate',
      align: 'center',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'center',
    },
    {
      title: 'Assigned',
      align: 'center',
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
      align: 'center',
      render: (key) => (
        <div className={styles.rowAction}>
          <span onClick={() => this.viewRequest(key)}>View request</span>
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
    alert('View Requests');
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
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys } = this.state;
    const rowSize = 20;
    const scroll = {
      x: '',
      y: 'max-content',
    };
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
      <div className={styles.LRTable}>
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
