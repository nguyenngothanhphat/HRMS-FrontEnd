import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import CustomModal from '@/components/CustomModal/index';
import ModalContent from '../FinalOffers/components/ModalContent/index';
import { COLUMN_NAME, TABLE_TYPE } from '../utils';

import { getActionText, getColumnWidth } from './utils';

import styles from './index.less';

class OnboardTable extends Component {
  constructor(props) {
    super(props);
    this.state = { pageSelected: 1, openModal: false };
  }

  handleActionClick = (tableType) => {
    const { SENT_FINAL_OFFERS, ACCEPTED_FINAL_OFFERS } = TABLE_TYPE;
    if (tableType === SENT_FINAL_OFFERS || tableType === ACCEPTED_FINAL_OFFERS) {
      this.setState((prevState) => ({ openModal: !prevState.openModal }));
    }
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  renderName = (id) => {
    const { list } = this.props;
    const selectedPerson = list.find((item) => item.rookieId === id);
    const { rookieName: name, isNew } = selectedPerson;
    if (isNew) {
      return (
        <p>
          {name}
          <span className={styles.new}>
            {formatMessage({ id: 'component.onboardingOverview.new' })}
          </span>
        </p>
      );
    }
    return <p>{name}</p>;
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
    const actionText = getActionText(type);

    const columns = [
      {
        // title: 'Rookie Id',
        title: formatMessage({ id: 'component.onboardingOverview.rookieId' }),
        dataIndex: 'rookieId',
        key: 'rookieId',
        width: getColumnWidth('rookieId', type),
        columnName: ID,
      },
      {
        // title: 'Rookie Name',
        title: formatMessage({ id: 'component.onboardingOverview.rookieName' }),
        dataIndex: 'rookieId',
        key: 'rookieID2',
        render: (rookieId) => this.renderName(rookieId),
        columnName: NAME,
        width: getColumnWidth('rookieName', type),
      },
      {
        // title: 'Position',
        title: formatMessage({ id: 'component.onboardingOverview.position' }),
        dataIndex: 'position',
        key: 'position',
        columnName: POSITION,
        width: getColumnWidth('position', type),
      },
      {
        // title: 'Location',
        title: formatMessage({ id: 'component.onboardingOverview.location' }),
        dataIndex: 'location',
        key: 'location',
        columnName: LOCATION,
        width: getColumnWidth('location', type),
      },
      {
        // title: 'Date sent',
        title: formatMessage({ id: 'component.onboardingOverview.dateSent' }),
        dataIndex: 'dateSent',
        key: 'dateSent',
        columnName: DATE_SENT,
        width: getColumnWidth('dateSent', type),
      },
      {
        // title: 'Date received',
        title: formatMessage({ id: 'component.onboardingOverview.dateReceived' }),
        dataIndex: 'dateReceived',
        key: 'dateReceived',
        columnName: DATE_RECEIVED,
        width: getColumnWidth('dateReceived', type),
      },
      {
        // title: 'Date of Joining',
        title: formatMessage({ id: 'component.onboardingOverview.dateJoin' }),
        dataIndex: 'dateJoin',
        key: 'dateJoin',
        columnName: DATE_JOIN,
        width: getColumnWidth('dateJoin', type),
      },
      {
        // title: 'Comments',
        title: formatMessage({ id: 'component.onboardingOverview.comments' }),
        dataIndex: 'comments',
        key: 'comments',
        width: getColumnWidth('comments', type),
        columnName: COMMENT,
      },
      {
        // title: 'Actions',
        title: formatMessage({ id: 'component.onboardingOverview.actions' }),
        dataIndex: 'actions',
        key: 'actions',
        width: getColumnWidth('actions', type),
        render: () => (
          <span className={styles.tableActions} onClick={() => {}}>
            {type === TABLE_TYPE.FINAL_OFFERS_DRAFTS ? (
              <>
                <span>{actionText}</span>

                <span className={styles.viewDraft}>
                  {formatMessage({ id: 'component.onboardingOverview.viewDraft' })}
                </span>
              </>
            ) : (
              <span onClick={() => this.handleActionClick(type)}>{actionText}</span>
            )}

            <EllipsisOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} />
          </span>
        ),
        columnName: ACTION,
      },
    ];

    // Filter only columns that are needed
    const newColumns = columns.filter((column) => columnArr.includes(column.columnName));

    return newColumns;
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  render() {
    const { pageSelected } = this.state;
    const { list } = this.props;
    const rowSize = 10;

    const rowSelection = {
      // onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // },
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
    const { openModal } = this.state;
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
        <CustomModal
          open={openModal}
          width={590}
          closeModal={this.closeModal}
          content={<ModalContent closeModal={this.closeModal} />}
        />
      </>
    );
  }
}

export default OnboardTable;
