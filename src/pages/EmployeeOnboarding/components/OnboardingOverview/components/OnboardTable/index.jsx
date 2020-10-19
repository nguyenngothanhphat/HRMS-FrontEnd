import React, { Component } from 'react';
import { Table, Empty, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage, Link, Redirect } from 'umi';

import CustomModal from '@/components/CustomModal/index';
import ModalContent from '../FinalOffers/components/ModalContent/index';
import { COLUMN_NAME, TABLE_TYPE } from '../utils';

import { getActionText, getColumnWidth } from './utils';

import styles from './index.less';

class OnboardTable extends Component {
  constructor(props) {
    super(props);
    this.state = { pageSelected: 1, openModal: false, currentRecord: {}, redirectScreen: null };
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

  renderAction = (id, type, actionText) => {
    const {
      FINAL_OFFERS_DRAFTS,
      RENEGOTIATE_PROVISIONAL_OFFERS,
      APPROVED_OFFERS,
      ACCEPTED_FINAL_OFFERS,
      RENEGOTIATE_FINAL_OFFERS,
    } = TABLE_TYPE;

    let actionContent = null;

    switch (type) {
      case RENEGOTIATE_PROVISIONAL_OFFERS:
      case RENEGOTIATE_FINAL_OFFERS:
        actionContent = (
          <>
            {/* <span>{actionText}</span> */}
            <span>Schedule 1-on-1</span>

            <span className={styles.viewDraft}>
              View Form
              {/* {formatMessage({ id: 'component.onboardingOverview.viewDraft' })} */}
            </span>
          </>
        );
        break;

      case FINAL_OFFERS_DRAFTS: {
        const menu = (
          <Menu>
            <Menu.Item key="1">Discard offer</Menu.Item>
          </Menu>
        );

        actionContent = (
          <>
            <span>Send for approval</span>

            <span className={styles.viewDraft}>
              {formatMessage({ id: 'component.onboardingOverview.viewDraft' })}
            </span>

            <Dropdown.Button
              overlay={menu}
              placement="bottomCenter"
              icon={<EllipsisOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} />}
            />
          </>
        );
        break;
      }

      case APPROVED_OFFERS:
        actionContent = (
          <>
            <span>Send to candidate</span>
            <span className={styles.viewDraft}>View form</span>
          </>
        );
        break;

      case ACCEPTED_FINAL_OFFERS: {
        const menu = (
          <Menu>
            <Menu.Item key="1">Discard offer</Menu.Item>
          </Menu>
        );

        actionContent = (
          <>
            <Dropdown.Button
              overlay={menu}
              placement="bottomCenter"
              icon={<EllipsisOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} />}
            >
              {actionText}
            </Dropdown.Button>
            {/* <span onClick={() => this.handleActionClick(type)}>{actionText}</span> */}
            {/* <EllipsisOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} /> */}
          </>
        );
        break;
      }

      default:
        actionContent = (
          <>
            <span onClick={() => this.handleActionClick(type)}>{actionText}</span>
            {/* <EllipsisOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} /> */}
          </>
        );
        break;
    }
    return (
      <Link to={`/employee-onboarding/review/${id}`}>
        <span className={styles.tableActions}>
          {actionContent}
          {/* {type === TABLE_TYPE.FINAL_OFFERS_DRAFTS ? (
          ) : (
            <span onClick={() => this.handleActionClick(type)}>{actionText}</span>
          )} */}

          {/* <EllipsisOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} /> */}
        </span>
      </Link>
    );
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
      EXPIRE,
      DOCUMENT,
      RESUBMIT,
      CHANGE_REQUEST,
      DATE_REQUEST,
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
        // title: formatMessage({ id: 'component.onboardingOverview.dateJoin' }),
        title: 'No. Of documents verified',
        dataIndex: 'documentVerified',
        key: 'document',
        columnName: DOCUMENT,
        width: getColumnWidth('document', type),
        align: 'center',
      },
      {
        // title: formatMessage({ id: 'component.onboardingOverview.dateJoin' }),
        title: 'Resubmits',
        dataIndex: 'resubmit',
        key: 'resubmit',
        columnName: RESUBMIT,
        width: getColumnWidth('resubmit', type),
        align: 'center',
      },
      {
        // title: formatMessage({ id: 'component.onboardingOverview.dateJoin' }),
        title: 'Expires on',
        dataIndex: 'expire',
        key: 'expire',
        columnName: EXPIRE,
        width: getColumnWidth('expire', type),
      },
      {
        // title: formatMessage({ id: 'component.onboardingOverview.dateJoin' }),
        title: 'Change request',
        dataIndex: 'changeRequest',
        key: 'changeRequest',
        columnName: CHANGE_REQUEST,
        width: getColumnWidth('changeRequest', type),
      },
      {
        // title: formatMessage({ id: 'component.onboardingOverview.dateJoin' }),
        title: 'Request date',
        dataIndex: 'dateRequest',
        key: 'dateRequest',
        columnName: DATE_REQUEST,
        width: getColumnWidth('dateRequest', type),
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
        render: () => {
          const { currentRecord = {} } = this.state;
          const { rookieId = '' } = currentRecord;
          const id = rookieId.replace('#', '') || '';
          return this.renderAction(id, type, actionText);
          // return (
          //   <Link to={`/employee-onboarding/review/${id}`}>
          //     <span className={styles.tableActions}>
          //       {type === TABLE_TYPE.FINAL_OFFERS_DRAFTS ? (
          //         <>
          //           <span>{actionText}</span>

          //           <span className={styles.viewDraft}>
          //             {formatMessage({ id: 'component.onboardingOverview.viewDraft' })}
          //           </span>
          //         </>
          //       ) : (
          //         <span onClick={() => this.handleActionClick(type)}>{actionText}</span>
          //       )}

          //       <EllipsisOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} />
          //     </span>
          //   </Link>
          // );
        },
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
            locale={{
              emptyText: (
                <Empty
                  description={formatMessage(
                    { id: 'component.onboardingOverview.noData' },
                    { format: 0 },
                  )}
                />
              ),
            }}
            columns={this.generateColumns(columnArr, type)}
            dataSource={list}
            pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
            onRow={(record, rowIndex) => {
              return {
                onMouseEnter: (event) => {
                  this.setState({
                    currentRecord: record,
                  });
                }, // Hover mouse on row
              };
            }}
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
