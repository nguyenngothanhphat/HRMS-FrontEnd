import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import OnboardModal from '../OnboardModal';
import { COLUMN_NAME, TABLE_TYPE } from '../utils';

// import img1 from './images/';
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
    case DISCARDED_FINAL_OFFERS:
      return 'view draft';
    case FINAL_OFFERS_DRAFTS:
      return 'send for approval';
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

  getColumnWidth = (columnName, tableType) => {
    const {
      ELIGIBLE_CANDIDATES,
      INELIGIBLE_CANDIDATES,
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

    if (tableType === ELIGIBLE_CANDIDATES) {
      switch (columnName) {
        case 'rookieId':
          return '';
        case 'rookieName':
          return '17%';
        case 'position':
          return '14%';
        case 'location':
          return '10%';
        case 'comments':
          return '24%';
        case 'actions':
          return '22%';
        default:
          return '';
      }
    }

    if (tableType === INELIGIBLE_CANDIDATES) {
      switch (columnName) {
        case 'rookieId':
          return '13%';
        case 'rookieName':
          return '19%';
        case 'position':
          return '16%';
        case 'location':
          return '';
        case 'comments':
          return '24%';
        case 'actions':
          return '13%';
        default:
          return '';
      }
    }

    if (tableType === SENT_PROVISIONAL_OFFERS) {
      switch (columnName) {
        case 'rookieId':
          return '14%';
        case 'rookieName':
          return '20%';
        case 'position':
          return '17%';
        case 'location':
          return '';
        case 'dateSent':
          return '18%';
        case 'actions':
          return '17%';
        default:
          return '';
      }
    }

    if (tableType === RECEIVED_PROVISIONAL_OFFERS) {
      switch (columnName) {
        case 'rookieId':
          return '15%';
        case 'rookieName':
          return '20%';
        case 'position':
          return '17%';
        case 'location':
          return '';
        case 'dateReceived':
          return '20%';
        case 'actions':
          return '13%';
        default:
          return '';
      }
    }

    if (tableType === DISCARDED_PROVISIONAL_OFFERS) {
      switch (columnName) {
        case 'rookieId':
          return '14%';
        case 'rookieName':
          return '18%';
        case 'position':
          return '17%';
        case 'location':
          return '';
        case 'comments':
          return '24%';
        case 'actions':
          return '13%';
        default:
          return '';
      }
    }

    if (tableType === PENDING_APPROVALS) {
      switch (columnName) {
        case 'rookieId':
          return '14%';
        case 'rookieName':
          return '15%';
        case 'position':
          return '17%';
        case 'location':
          return '';
        case 'dateJoin':
          return '20%';
        case 'actions':
          return '13%';
        default:
          return '';
      }
    }

    if (tableType === APPROVED_FINAL_OFFERS) {
      switch (columnName) {
        case 'rookieId':
          return '14%';
        case 'rookieName':
          return '15%';
        case 'position':
          return '17%';
        case 'location':
          return '';
        case 'dateJoin':
          return '20%';
        case 'actions':
          return '13%';
        default:
          return '';
      }
    }

    if (tableType === REJECTED_FINAL_OFFERS) {
      switch (columnName) {
        case 'rookieId':
          return '14%';
        case 'rookieName':
          return '17%';
        case 'position':
          return '17%';
        case 'location':
          return '';
        case 'comments':
          return '25%';
        case 'actions':
          return '13%';
        default:
          return '';
      }
    }

    if (tableType === SENT_FINAL_OFFERS) {
      switch (columnName) {
        case 'rookieId':
          return '15%';
        case 'rookieName':
          return '20%';
        case 'position':
          return '18%';
        case 'location':
          return '';
        case 'dateJoin':
          return '20%';
        case 'actions':
          return '13%';
        default:
          return '';
      }
    }

    if (tableType === ACCEPTED_FINAL_OFFERS) {
      switch (columnName) {
        case 'rookieId':
          return '12%';
        case 'rookieName':
          return '17%';
        case 'position':
          return '17%';
        case 'location':
          return '';
        case 'dateJoin':
          return '17%';
        case 'comments':
          return '24%';
        case 'actions':
          return '12%';
        default:
          return '';
      }
    }

    if (tableType === FINAL_OFFERS_DRAFTS) {
      switch (columnName) {
        case 'rookieId':
          return '12%';
        case 'rookieName':
          return '17%';
        case 'position':
          return '16%';
        case 'location':
          return '';
        case 'dateJoin':
          return '16%';
        case 'actions':
          return '19%';
        default:
          return '';
      }
    }

    if (tableType === DISCARDED_FINAL_OFFERS) {
      switch (columnName) {
        case 'rookieId':
          return '12%';
        case 'rookieName':
          return '18%';
        case 'position':
          return '14%';
        case 'location':
          return '10%';
        case 'comments':
          return '24%';
        case 'actions':
          return '13%';
        default:
          return '';
      }
    }
  };

  generateColumns = (columnArr = ['id'], type = TABLE_TYPE.PROVISIONAL_OFFER) => {
    const {
      ID,
      NAME,
      POSITION,
      LOCATION,
      COMMENT,
      DATE_SENT,
      DATE_RECEIVED,
      DATE_JOIN,
      ACTION,
    } = COLUMN_NAME;
    const { ELIGIBLE_CANDIDATES } = TABLE_TYPE;
    const actionText = getActionText(type);

    const columns = [
      {
        title: 'Rookie Id',
        dataIndex: 'rookieId',
        key: 'rookieId',
        width: this.getColumnWidth('rookieId', type),
        columnName: ID,
      },
      {
        title: 'Rookie Name',
        dataIndex: 'rookieId',
        key: 'rookieID2',
        render: (rookieId) => this.renderName(rookieId),
        columnName: NAME,
        width: this.getColumnWidth('rookieName', type),
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        columnName: POSITION,
        width: this.getColumnWidth('position', type),
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        columnName: LOCATION,
        width: this.getColumnWidth('location', type),
      },
      {
        title: 'Date sent',
        dataIndex: 'dateSent',
        key: 'dateSent',
        columnName: DATE_SENT,
        width: this.getColumnWidth('dateSent', type),
      },
      {
        title: 'Date received',
        dataIndex: 'dateReceived',
        key: 'dateReceived',
        columnName: DATE_RECEIVED,
        width: this.getColumnWidth('dateReceived', type),
      },
      {
        title: 'Date of Joining',
        dataIndex: 'dateJoin',
        key: 'dateJoin',
        columnName: DATE_JOIN,
        width: this.getColumnWidth('dateJoin', type),
      },
      {
        title: 'Comments',
        dataIndex: 'comments',
        key: 'comments',
        width: this.getColumnWidth('comments', type),
        columnName: COMMENT,
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: this.getColumnWidth('actions', type),
        render: () => (
          <span className={styles.tableActions} onClick={() => {}}>
            {type === TABLE_TYPE.FINAL_OFFERS_DRAFTS ? (
              // <div className={styles.actionBtn}>
              // <p>
              <>
                <span>{actionText}</span>

                <span className={styles.viewDraft}>View Draft</span>
              </>
            ) : (
              // </p>
              // </div>
              <span>{actionText}</span>
            )}

            <EllipsisOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} />
          </span>
        ),
        columnName: ACTION,
      },
    ];

    // Filter only columns that are needed
    let newColumns = columns.filter((column) => columnArr.includes(column.columnName));

    return newColumns;
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

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
      }),
    };

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

    const { columnArr, type, inTab, hasCheckbox } = this.props;

    return (
      <>
        <div className={`${styles.OnboardTable} ${inTab ? styles.inTab : ''}`}>
          <Table
            size="small"
            rowSelection={
              hasCheckbox && {
                type: 'checkbox',
                ...rowSelection,
              }
            }
            columns={this.generateColumns(columnArr, type)}
            dataSource={list}
            pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
            // scroll={{ x: 1000, y: 'max-content' }}
          />
        </div>
        {/* <OnboardModal
          open={this.state.isOpen}
          bodyContent={bodyContent}
          handleCancle={() => {
            this.setState({
              isOpen: false,
            });
          }}
        /> */}
      </>
    );
  }
}

export default OnboardTable;
