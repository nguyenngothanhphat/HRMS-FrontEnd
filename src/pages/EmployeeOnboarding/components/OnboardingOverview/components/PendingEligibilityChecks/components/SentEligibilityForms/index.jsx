import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import styles from './index.less';

class SentEligibilityForms extends Component {
  constructor(props) {
    super(props);
    this.state = { sortedName: {}, pageSelected: 1 };
  }

  generateColumns = () => {
    const columns = [
      {
        title: 'Rookie Id',
        dataIndex: 'rookieId',
        key: 'rookieId',
      },
      {
        title: 'Rookie Name',
        dataIndex: 'rookieName',
        key: 'rookieName',
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: 'Date Sent',
        dataIndex: 'dateSent',
        key: 'dateSent',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: () => (
          <span className={styles.table_actions}>
            <p>View form</p>
            <EllipsisOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} />
          </span>
        ),
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  render() {
    const { sortedName = {}, pageSelected } = this.state;
    const rowSize = 10;
    const list = [
      {
        rookieId: 123,
        rookieName: 'name test',
        position: 'Engineer',
        location: 'Ho Chi Minh City',
        dateSent: '12/12/2020',
      },
      {
        rookieId: 123,
        rookieName: 'name test',
        position: 'Engineer',
        location: 'Ho Chi Minh City',
        dateSent: '12/12/2020',
      },
      {
        rookieId: 123,
        rookieName: 'name test',
        position: 'Engineer',
        location: 'Ho Chi Minh City',
        dateSent: '12/12/2020',
      },
    ];
    const pagination = {
      position: ['bottomRight'],
      total: list.length,
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

    return (
      <div className={styles.SentEligibilityForms}>
        <Table
          size="small"
          columns={this.generateColumns(sortedName)}
          dataSource={list}
          pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}

          // scroll={{ x: 1000, y: 'max-content' }}
        />
      </div>
    );
  }
}

export default SentEligibilityForms;
