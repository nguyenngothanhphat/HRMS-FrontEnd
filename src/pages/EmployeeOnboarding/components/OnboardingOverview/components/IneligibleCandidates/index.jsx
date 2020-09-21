import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import styles from './index.less';

const list = [
  {
    rookieId: '#160031340',
    isNew: true,
    rookieName: 'Matt Wagoner',
    position: 'Sr. UX Designer',
    location: 'Mumbai',
    comments: 'Passport submission pending …',
  },
  {
    rookieId: '#18001829',
    rookieName: 'JT Grauke',
    position: 'UI Designer',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
  },
  {
    rookieId: '#16210862',
    rookieName: 'Ryan Jhonson',
    position: 'Sr. UI Designer',
    location: 'Chennai',
    comments: 'Fake eligibility documents',
  },
  {
    rookieId: '#10928389',
    rookieName: 'Billy Hoffman',
    position: 'Illustrator',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
  },
  {
    rookieId: '#16003134',
    rookieName: 'Karthik Naren',
    position: 'Jr. UI Designer',
    location: 'Dubai',
    comments: 'Eligibility date expireds',
  },
  {
    rookieId: '#16210862',
    rookieName: 'Ema Drek',
    position: 'Sr. UX Designer',
    location: 'Bangalore',
    comments: 'Eligibility date expired',
  },
  {
    rookieId: '#10928389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
  },
  {
    rookieId: '#10928389',
    rookieName: 'Siddartha',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
  },
  {
    rookieId: '#10928389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
  },
  {
    rookieId: '#10928389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
  },
  // Clone
  {
    rookieId: '#16003134',
    rookieName: 'Matt Wagoner',
    position: 'Sr. UX Designer',
    location: 'Mumbai',
    comments: 'Passport submission pending …',
  },
  {
    rookieId: '#18001829',
    rookieName: 'JT Grauke',
    position: 'UI Designer',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
  },
  {
    rookieId: '#16210862',
    rookieName: 'Ryan Jhonson',
    position: 'Sr. UI Designer',
    location: 'Chennai',
    comments: 'Fake eligibility documents',
  },
  {
    rookieId: '#10928389',
    rookieName: 'Billy Hoffman',
    position: 'Illustrator',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
  },
  {
    rookieId: '#16003134',
    rookieName: 'Karthik Naren',
    position: 'Jr. UI Designer',
    location: 'Dubai',
    comments: 'Eligibility date expireds',
  },
  {
    rookieId: '#16210862',
    rookieName: 'Ema Drek',
    position: 'Sr. UX Designer',
    location: 'Bangalore',
    comments: 'Eligibility date expired',
  },
  {
    rookieId: '#10928389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
  },
  {
    rookieId: '#10928389',
    rookieName: 'Siddartha',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
  },
  {
    rookieId: '#10928389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
  },
  {
    rookieId: '#10928389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
  },
  // Clone
];

class IneligibleCandidates extends Component {
  constructor(props) {
    super(props);
    this.state = { sortedName: {}, pageSelected: 1 };
  }

  renderName = (id) => {
    const selectedPerson = list.find((item) => item.rookieId === id);
    const { rookieName: name, isNew } = selectedPerson;
    if (isNew) {
      return <span>{`${name} NEW`}</span>;
    }
    return <span>{name}</span>;
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Rookie Id',
        dataIndex: 'rookieId',
        key: 'rookieId',
      },
      {
        title: 'Rookie Name',
        dataIndex: 'rookieId',
        key: 'rookieID2',
        render: (rookieId) => this.renderName(rookieId),
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
        title: 'Comments',
        dataIndex: 'comments',
        key: 'comments',
        width: '26%',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '12%',
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
      <div className={styles.IneligibleCandidates}>
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

export default IneligibleCandidates;
