import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import { COLUMN_NAME, TABLE_TYPE } from '../utils';

import styles from './index.less';

const getActionText = (type) => {
  const {
    PENDING_ELIGIBILITY_CHECKS,
    INELIGIBLE_CANDIDATES,
    ELIGIBLE_CANDIDATES,
    SENT_PROVISIONAL_OFFERS,
    RECEIVED_PROVISIONAL_OFFERS,
    DISCARDED_PROVISIONAL_OFFERS,
    PENDING_APPROVALS,
    APPROVED_FINAL_OFFERS,
    REJECTED_FINAL_OFFERS,
    SENT_FINAL_OFFERS,
    ACCEPTED_FINAL_OFFERS,
    FINAL_OFFERS_DRAFTS,
    DISCARDED_FINAL_OFFERS,
  } = TABLE_TYPE;
  console.log(type);
  switch (type) {
    case PENDING_ELIGIBILITY_CHECKS:
      return 'review';
    case ELIGIBLE_CANDIDATES:
      return 'prepare provisial offer';
    case SENT_PROVISIONAL_OFFERS:
      return 'draft final offer';
    case RECEIVED_PROVISIONAL_OFFERS:
    case INELIGIBLE_CANDIDATES:
    case DISCARDED_PROVISIONAL_OFFERS:
      return 'view form';
    case APPROVED_FINAL_OFFERS:
      return 'send offer';
    case PENDING_APPROVALS:
    case REJECTED_FINAL_OFFERS:
    case SENT_FINAL_OFFERS:
    case FINAL_OFFERS_DRAFTS:
    case DISCARDED_FINAL_OFFERS:
      return 'view draft';
    case ACCEPTED_FINAL_OFFERS:
      return 'create profile';
    default:
      return '';
  }
};

class OnboardTable extends Component {
  constructor(props) {
    super(props);
    this.state = { sortedName: {}, pageSelected: 1 };
  }

  renderName = (id) => {
    const { list } = this.props;
    const selectedPerson = list.find((item) => item.rookieId === id);
    const { rookieName: name, isNew } = selectedPerson;
    if (isNew) {
      return (
        <p>
          {name}
          <span className={styles.new}>new</span>
        </p>
      );
    }
    return <p>{name}</p>;
  };

  generateColumns = (columnArr = ['id'], type = TABLE_TYPE.PROVISIONAL_OFFER) => {
    const { ID, NAME, POSITION, LOCATION, COMMENT, DATE_SENT, ACTION } = COLUMN_NAME;
    const actionText = getActionText(type);
    console.log(actionText);
    const columns = [
      {
        title: 'Rookie Id',
        dataIndex: 'rookieId',
        key: 'rookieId',
        columnName: ID,
      },
      {
        title: 'Rookie Name',
        dataIndex: 'rookieId',
        key: 'rookieID2',
        render: (rookieId) => this.renderName(rookieId),
        width: '17%',
        columnName: NAME,
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        // width: '13%',
        columnName: POSITION,
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        columnName: LOCATION,
      },
      {
        title: 'Date sent',
        dataIndex: 'dateSent',
        key: 'dateSent',
        columnName: DATE_SENT,
      },
      {
        title: 'Comments',
        dataIndex: 'comments',
        key: 'comments',
        width: '23%',
        columnName: COMMENT,
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '12%',
        render: () => (
          <span className={styles.tableActions}>
            <p>{actionText}</p>
            <EllipsisOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} />
          </span>
        ),
        columnName: ACTION,
      },
    ];

    // Filter only columns that are needed
    let newColumns = columns.filter((column) => columnArr.includes(column.columnName));
    console.log(newColumns);

    return newColumns;
    // return columns.map((col) => ({
    //   ...col,
    //   title: col.title,
    // }));
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  render() {
    const { sortedName = {}, pageSelected } = this.state;
    const { list, hasBorder } = this.props;
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

    const { columnArr, type, inTab } = this.props;

    return (
      <div className={`${styles.OnboardTable} ${inTab ? styles.inTab : ''}`}>
        <Table
          size="small"
          columns={this.generateColumns(columnArr, type)}
          dataSource={list}
          pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
          // scroll={{ x: 1000, y: 'max-content' }}
        />
      </div>
    );
  }
}

export default OnboardTable;
