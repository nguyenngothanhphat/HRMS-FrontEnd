import React, { Component } from 'react';
import { Table, Empty, Dropdown, Menu, Tag } from 'antd';
// import { EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatMessage, Link, connect, history } from 'umi';

import CustomModal from '@/components/CustomModal/index';
import { getAuthority, getCurrentTenant } from '@/utils/authority';
// import ModalContent from '../FinalOffers/components/ModalContent/index';
import MenuIcon from '@/assets/menuDots.svg';
import ProfileModalContent from '../FinalOffers/components/ProfileModalContent';
import { COLUMN_NAME, TABLE_TYPE } from '../utils';
import ReassignModal from './components/ReassignModal';
import { getActionText, getColumnWidth } from './utils';
import styles from './index.less';

class OnboardTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // pageSelected: 1,
      openModal: false,
      currentRecord: {},
      reassignModalVisible: false,
      currentEmpId: '',
      reassignTicketId: '',
      reassignStatus: '',
      reassignType: '',
    };
  }

  handleActionClick = (tableType) => {
    const { SENT_FINAL_OFFERS, ACCEPTED_FINAL_OFFERS } = TABLE_TYPE;
    if (tableType === SENT_FINAL_OFFERS || tableType === ACCEPTED_FINAL_OFFERS) {
      this.setState((prevState) => ({ openModal: !prevState.openModal }));
    }
  };

  handleActionDelete = (id) => {
    const { dispatch } = this.props;

    if (!dispatch) {
      return;
    }

    dispatch({
      type: 'onboard/deleteTicketDraft',
      payload: {
        id,
        tenantId: getCurrentTenant(),
      },
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  getModalContent = () => {
    const { dispatch } = this.props;
    const { currentRecord } = this.state;
    const { rookieId = '' } = currentRecord;
    return (
      <ProfileModalContent closeModal={this.closeModal} dispatch={dispatch} rookieId={rookieId} />
    );
    // return <ModalContent closeModal={this.closeModal} />;
  };

  openModal = () => {
    this.setState({
      openModal: true,
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
    return <p>{name || '-'}</p>;
  };

  fetchData = () => {
    // const { dispatch } = this.props;
    // if (!dispatch) {
    //   return;
    // }
    // dispatch({
    //   type: 'candidateInfo/fetchCandidateInfo',
    // });
    // console.log('abc');
  };

  initiateBackgroundCheck = (id) => {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'onboard/inititateBackgroundCheckEffect',
      payload: {
        rookieID: id,
        tenantId: getCurrentTenant(),
      },
    });
  };

  checkPermission = (role) => {
    const getAuth = getAuthority();
    let check = false;
    getAuth.forEach((item) => {
      if (item.toLowerCase().includes(role)) {
        check = true;
      }
    });
    return check;
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
      ASSIGN_TO,
      ASSIGNEE_MANAGER,
      PROCESS_STATUS,
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
        fixed: 'left',
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
        render: (position) => <span>{position || '-'}</span>,
        columnName: POSITION,
        width: getColumnWidth('position', type),
      },
      {
        // title: 'Location',
        title: formatMessage({ id: 'component.onboardingOverview.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (location) => <span>{location || '-'}</span>,
        columnName: LOCATION,
        width: getColumnWidth('location', type),
      },
      {
        // title: 'Date sent',
        title: formatMessage({ id: 'component.onboardingOverview.dateSent' }),
        dataIndex: 'dateSent',
        key: 'dateSent',
        render: (dateSent) => <span>{dateSent || '-'}</span>,
        columnName: DATE_SENT,
        width: getColumnWidth('dateSent', type),
      },
      {
        // title: 'Date received',
        title: formatMessage({ id: 'component.onboardingOverview.dateReceived' }),
        dataIndex: 'dateReceived',
        key: 'dateReceived',
        render: (dateReceived) => <span>{dateReceived || '-'}</span>,
        columnName: DATE_RECEIVED,
        width: getColumnWidth('dateReceived', type),
      },
      {
        // title: 'Date of Joining',
        title: formatMessage({ id: 'component.onboardingOverview.dateJoin' }),
        dataIndex: 'dateJoin',
        key: 'dateJoin',
        render: (dateJoin) => <span>{dateJoin || '-'}</span>,
        columnName: DATE_JOIN,
        width: getColumnWidth('dateJoin', type),
      },
      {
        // title: 'No. Of documents verified',
        title: formatMessage({ id: 'component.onboardingOverview.documentVerified' }),
        dataIndex: 'documentVerified',
        key: 'document',
        render: (documentVerified) => <span>{documentVerified || '-'}</span>,
        columnName: DOCUMENT,
        width: getColumnWidth('document', type),
        align: 'center',
      },
      {
        // title: 'Resubmits',
        title: formatMessage({ id: 'component.onboardingOverview.resubmit' }),
        dataIndex: 'resubmit',
        key: 'resubmit',
        render: (resubmit) => <span>{resubmit || '-'}</span>,
        columnName: RESUBMIT,
        width: getColumnWidth('resubmit', type),
        align: 'center',
      },
      {
        // title: 'Expires on',
        title: formatMessage({ id: 'component.onboardingOverview.expire' }),
        dataIndex: 'expire',
        key: 'expire',
        render: (expire) => <span>{expire || '-'}</span>,
        columnName: EXPIRE,
        width: getColumnWidth('expire', type),
      },
      {
        // title: 'Change request',
        title: formatMessage({ id: 'component.onboardingOverview.changeRequest' }),
        dataIndex: 'changeRequest',
        key: 'changeRequest',
        render: (changeRequest) => <span>{changeRequest || '-'}</span>,
        columnName: CHANGE_REQUEST,
        width: getColumnWidth('changeRequest', type),
      },
      {
        // title: 'Request date',
        title: formatMessage({ id: 'component.onboardingOverview.requestDate' }),
        dataIndex: 'dateRequest',
        key: 'dateRequest',
        render: (dateRequest) => <span>{dateRequest || '-'}</span>,
        columnName: DATE_REQUEST,
        width: getColumnWidth('dateRequest', type),
      },
      {
        // title: 'Comments',
        title: formatMessage({ id: 'component.onboardingOverview.comments' }),
        dataIndex: 'comments',
        key: 'comments',
        render: (comments) => <span>{comments || '-'}</span>,
        width: getColumnWidth('comments', type),
        columnName: COMMENT,
      },
      {
        title: 'Assign To',
        dataIndex: 'assignTo',
        key: 'assignTo',
        render: (assignTo) => (
          <span className={styles.renderAssignee} onClick={() => this.viewProfile(assignTo.userId)}>
            {assignTo?.generalInfo?.firstName + assignTo?.generalInfo?.lastName || '-'}
          </span>
        ),
        columnName: ASSIGN_TO,
        width: getColumnWidth('assignTo', type),
      },
      {
        title: 'HR Manager',
        dataIndex: 'assigneeManager',
        key: 'assigneeManager',
        render: (assigneeManager) => (
          <span
            className={styles.renderAssignee}
            onClick={() => this.viewProfile(assigneeManager.userId)}
          >
            {assigneeManager?.generalInfo?.firstName + assigneeManager?.generalInfo?.lastName ||
              '-'}
          </span>
        ),
        columnName: ASSIGNEE_MANAGER,
        width: getColumnWidth('assigneeManager', type),
      },
      {
        title: 'Status',
        dataIndex: 'processStatus',
        key: 'processStatus',
        render: (processStatus) => <Tag color="geekblue">{processStatus}</Tag>,
        columnName: PROCESS_STATUS,
        width: getColumnWidth('processStatus', type),
        fixed: 'right',
      },
      {
        // title: 'Actions',
        // title: formatMessage({ id: 'component.onboardingOverview.actions' }),
        dataIndex: 'actions',
        key: 'actions',
        width: getColumnWidth('actions', type),
        align: 'center',
        render: (_, row) => {
          const { currentUser: { employee: { _id: empId = '' } = {} } = {} } = this.props;
          const { processStatusId = '', rookieId = '', assignTo = {}, assigneeManager = {} } = row;
          const id = rookieId.replace('#', '') || '';

          const checkPermission =
            this.checkPermission('hr-manager') ||
            assignTo._id === empId ||
            assigneeManager._id === empId;
          // if (checkPermission) return this.renderAction(id, type, actionText);
          // return '';

          if (checkPermission)
            return (
              <Dropdown
                className={styles.menuIcon}
                overlay={this.actionMenu(id, assignTo?._id, type, actionText, processStatusId)}
                placement="topLeft"
              >
                <img src={MenuIcon} alt="menu" />
              </Dropdown>
            );
          return '';
        },
        columnName: ACTION,
        fixed: 'right',
      },
    ];

    // Filter only columns that are needed
    const newColumns = columns.filter((column) => columnArr.includes(column.columnName));

    return newColumns;
  };

  actionMenu = (id, currentEmpId, type, actionText, processStatusId) => {
    const {
      PROVISIONAL_OFFERS_DRAFTS,
      FINAL_OFFERS_DRAFTS,
      RENEGOTIATE_PROVISIONAL_OFFERS,
      RENEGOTIATE_FINAL_OFFERS,
      APPROVED_OFFERS,
      ACCEPTED_FINAL_OFFERS,
      ACCEPTED__PROVISIONAL_OFFERS,
    } = TABLE_TYPE;
    const isRemovable = type === PROVISIONAL_OFFERS_DRAFTS;
    const isHRManager = this.checkPermission('hr-manager');

    let menuItem = '';
    switch (type) {
      case PROVISIONAL_OFFERS_DRAFTS:
        menuItem = (
          <Menu.Item>
            <Link to={`/employee-onboarding/review/${id}`} onClick={() => this.fetchData()}>
              <span>Continue</span>
            </Link>
          </Menu.Item>
        );
        break;

      case RENEGOTIATE_PROVISIONAL_OFFERS:
      case RENEGOTIATE_FINAL_OFFERS:
        menuItem = (
          <>
            <Menu.Item>
              <Link to={`/employee-onboarding/review/${id}`} onClick={() => this.fetchData()}>
                <span>Schedule 1-on-1</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/employee-onboarding/review/${id}`} onClick={() => this.fetchData(id)}>
                <span className={styles.viewDraft}>View Form</span>
              </Link>
            </Menu.Item>
          </>
        );
        break;

      case ACCEPTED__PROVISIONAL_OFFERS:
        menuItem = (
          <Menu.Item>
            <Link
              to={`/employee-onboarding/review/${id}`}
              onClick={() => {
                this.initiateBackgroundCheck(id);
              }}
            >
              <span>Initiate Background Check</span>
            </Link>
          </Menu.Item>
        );
        break;

      case FINAL_OFFERS_DRAFTS:
        menuItem = (
          <>
            <Menu.Item>
              <Link to={`/employee-onboarding/review/${id}`} onClick={() => this.fetchData(id)}>
                Send for approval
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/employee-onboarding/review/${id}`} onClick={() => this.fetchData(id)}>
                <span className={styles.viewDraft}>View Form</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/employee-onboarding/review/${id}`} onClick={() => this.fetchData(id)}>
                Discard offer
              </Link>
            </Menu.Item>
          </>
        );
        break;

      case APPROVED_OFFERS:
        menuItem = (
          <>
            <Menu.Item>
              <Link to={`/employee-onboarding/review/${id}`} onClick={() => this.fetchData(id)}>
                Send to candidate
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/employee-onboarding/review/${id}`} onClick={() => this.fetchData(id)}>
                <span className={styles.viewDraft}>View Form</span>
              </Link>
            </Menu.Item>
          </>
        );
        break;

      case ACCEPTED_FINAL_OFFERS:
        menuItem = (
          <Menu.Item>
            <span
              onClick={() => {
                this.openModal();
              }}
            >
              Create Profile
            </span>
          </Menu.Item>
        );
        break;
      default:
        menuItem = (
          <Menu.Item>
            <Link to={`/employee-onboarding/review/${id}`} onClick={() => this.fetchData(id)}>
              <span onClick={() => this.handleActionClick(type)}>{actionText}</span>
            </Link>
          </Menu.Item>
        );
        break;
    }

    return (
      <Menu>
        {menuItem}
        {isHRManager && (
          <Menu.Item>
            <div
              onClick={() =>
                this.handleReassignModal(true, currentEmpId, id, processStatusId, type)}
            >
              Re-assign
            </div>
          </Menu.Item>
        )}
        <Menu.Item disabled={!isRemovable}>
          <div onClick={isRemovable ? () => this.handleActionDelete(id) : () => {}}>Delete</div>
        </Menu.Item>
      </Menu>
    );
  };

  handleReassignModal = (value, currentEmpId, id, processStatusId, type) => {
    this.setState({
      reassignModalVisible: value,
      currentEmpId,
      reassignTicketId: id,
      reassignStatus: processStatusId,
      reassignType: type,
    });
  };

  viewProfile = (_id) => {
    history.push(`/directory/employee-profile/${_id}`);
  };

  // onChangePagination = (pageNumber) => {
  //   this.setState({
  //     pageSelected: pageNumber,
  //   });
  // };

  render() {
    // const { pageSelected } = this.state;
    const { list = [], pageSelected, size, getPageAndSize, total: totalData } = this.props;
    // const rowSize = 10;
    console.log('size', size, 'pageSelected', pageSelected);
    const {
      reassignModalVisible = false,
      currentEmpId = '',
      reassignTicketId = '',
      reassignStatus = '',
      reassignType = '',
    } = this.state;

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
      position: ['bottomLeft'],
      total: totalData,
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
      defaultPageSize: size,
      showSizeChanger: true,
      pageSizeOptions: ['10', '25', '50', '100'],
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
    };

    const { columnArr, type, inTab, hasCheckbox, loading, loadingFetch } = this.props;
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
            loading={loading || loadingFetch}
            // pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
            pagination={pagination}
            onRow={(record) => {
              return {
                onMouseEnter: () => {
                  this.setState({
                    currentRecord: record,
                  });
                }, // Hover mouse on row
              };
            }}
            scroll={list.length > 0 ? { x: 'max-content', y: 'max-content' } : {}}
          />
        </div>
        <CustomModal
          open={openModal}
          width={590}
          closeModal={this.closeModal}
          content={this.getModalContent()}
        />
        <ReassignModal
          visible={reassignModalVisible}
          currentEmpId={currentEmpId}
          reassignTicketId={reassignTicketId}
          handleReassignModal={this.handleReassignModal}
          type={reassignType}
          processStatus={reassignStatus}
          page={pageSelected}
          limit={size}
        />
      </>
    );
  }
}

// export default OnboardTable;
export default connect(({ candidateInfo, loading, user: { currentUser = {} } = {} }) => ({
  isAddNewMember: candidateInfo.isAddNewMember,
  loading: loading.effects['onboard/fetchOnboardList'],
  currentUser,
}))(OnboardTable);
