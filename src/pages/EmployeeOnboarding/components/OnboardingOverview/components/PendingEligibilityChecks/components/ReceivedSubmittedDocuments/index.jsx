import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import styles from './index.less';

class ReceivedSubmittedDocuments extends Component {
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
        title: 'Date Received',
        dataIndex: 'dateReceived',
        key: 'dateReceived',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '12%',
        render: () => (
          <span className={styles.table_actions}>
            <p>Review</p>
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

  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  render() {
    const { sortedName = {}, pageSelected } = this.state;
    const rowSize = 10;
    const list = [
      {
        rookieId: '#16003134',
        rookieName: 'Matt Wagoner',
        position: 'Sr. UX Designer',
        location: 'Mumbai',
        dateReceived: '22nd June, 2020',
      },
      {
        rookieId: '#18001829',
        rookieName: 'JT Grauke',
        position: 'UI Designer',
        location: 'Mumbai',
        dateReceived: '24th Sept, 2020',
      },
      {
        rookieId: '#16210862',
        rookieName: 'Ryan Jhonson',
        position: 'Sr. UX Designer',
        location: 'Chennai',
        dateReceived: '14th Dec, 2020',
      },
      {
        rookieId: '#10928389',
        rookieName: 'Billy Hoffman',
        position: 'Illustrator',
        location: 'Mumbai',
        dateReceived: '11th June, 2020',
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
      <div className={styles.ReceivedSubmittedDocuments}>
        <Table
          size="small"
          columns={this.generateColumns(sortedName)}
          dataSource={list}
          pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
          onChange={this.handleChangeTable}

          // scroll={{ x: 1000, y: 'max-content' }}
        />
      </div>
    );
  }
}

export default ReceivedSubmittedDocuments;
