import React, { Component } from 'react';
import { Table, Empty, Dropdown, Menu, Tag } from 'antd';
import { formatMessage, Link, connect, history } from 'umi';
import moment from 'moment';

// import CustomModal from '@/components/CustomModal/index';
// import ProfileModalContent from '../FinalOffers/components/ProfileModalContent';
import MenuIcon from '@/assets/menuDots.svg';
import { PROCESS_STATUS } from '@/utils/onboarding';
import { getAuthority, getCurrentTenant } from '@/utils/authority';
import { COLUMN_NAME, TABLE_TYPE } from '../utils';
import { getActionText, getColumnWidth } from './utils';

import ReassignModal from './components/ReassignModal';
import RenewModal from './components/RenewModal';

import styles from './index.less';

const compare = (dateTimeA, dateTimeB) => {
  const momentA = moment(dateTimeA, 'DD/MM/YYYY');
  const momentB = moment(dateTimeB, 'DD/MM/YYYY');
  if (momentA > momentB) return 1;
  if (momentA < momentB) return -1;
  return 0;
};
class OnboardTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // pageSelected: 1,
      openModal: false,
      // currentRecord: {},
      reassignModalVisible: false,
      currentEmpId: '',
      reassignTicketId: '',
      reassignStatus: '',
      reassignType: '',

      // expiry tickets
      renewModalVisible: false,
      selectedExpiryTicketId: '',
      expiryStatus: '',
      expiryType: '',
    };
  }

  handleActionClick = (ticketType) => {
    const { SENT_FINAL_OFFERS, ACCEPTED_FINAL_OFFERS } = PROCESS_STATUS;
    if (ticketType === SENT_FINAL_OFFERS || ticketType === ACCEPTED_FINAL_OFFERS) {
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

  openModal = () => {
    this.setState({
      openModal: true,
    });
  };

  // getModalContent = () => {
  //   const { dispatch } = this.props;
  //   const { currentRecord } = this.state;
  //   const { rookieId = '' } = currentRecord;
  //   return (
  //     <ProfileModalContent closeModal={this.closeModal} dispatch={dispatch} rookieId={rookieId} />
  //   );
  //   // return <ModalContent closeModal={this.closeModal} />;
  // };

  renderRookieId = (rookieId, type) => {
    const id = rookieId.replace('#', '') || '';
    return (
      <Link to={`/employee-onboarding/list/review/${id}`} onClick={() => this.fetchData(id)}>
        <span onClick={() => this.handleActionClick(type)}>{rookieId}</span>
      </Link>
    );
  };

  renderName = (id) => {
    const { list } = this.props;
    const selectedPerson = list.find((item) => item.rookieId === id);
    const { rookieName: name = '', isNew, offerExpiryDate = '' } = selectedPerson;
    const isExpired = compare(moment(), moment(offerExpiryDate)) === 1;

    if (isExpired) {
      return (
        <p>
          {name && <span className={styles.name}>{name}</span>}
          <span className={styles.expired}>Expired</span>
        </p>
      );
    }
    if (isNew) {
      return (
        <p>
          {name && <span className={styles.name}>{name}</span>}
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

  generateColumns = (columnArr = ['id'], type = TABLE_TYPE.ALL) => {
    const {
      ID,
      NAME,
      POSITION,
      LOCATION,
      DATE_JOIN,
      ACTION,
      ASSIGN_TO,
      ASSIGNEE_MANAGER,
      PROCESS_STATUS: PROCESS_STATUS_1,
    } = COLUMN_NAME;
    const actionText = getActionText(type);

    const columns = [
      {
        // title: 'Rookie Id',
        title: formatMessage({ id: 'component.onboardingOverview.candidateId' }),
        dataIndex: 'rookieId',
        key: 'rookieId',
        width: getColumnWidth('rookieId', type),
        render: (rookieId) => this.renderRookieId(rookieId, type),
        columnName: ID,
        fixed: 'left',
      },
      {
        // title: 'Rookie Name',
        title: formatMessage({ id: 'component.onboardingOverview.candidateName' }),
        dataIndex: 'rookieId',
        key: 'rookieID2',
        render: (rookieId) => this.renderName(rookieId),
        columnName: NAME,
        width: getColumnWidth('rookieName', type),
        align: 'left',
      },
      {
        // title: 'Position',
        title: formatMessage({ id: 'component.onboardingOverview.position' }),
        dataIndex: 'position',
        key: 'position',
        render: (position) => <span>{position || '-'}</span>,
        columnName: POSITION,
        width: getColumnWidth('position', type),
        align: 'left',
      },
      {
        // title: 'Location',
        title: formatMessage({ id: 'component.onboardingOverview.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (location) => <span>{location || '-'}</span>,
        columnName: LOCATION,
        width: getColumnWidth('location', type),
        align: 'left',
      },
      {
        // title: 'Date of Joining',
        title: formatMessage({ id: 'component.onboardingOverview.dateJoin' }),
        dataIndex: 'dateJoin',
        key: 'dateJoin',
        render: (dateJoin) => <span>{dateJoin || '-'}</span>,
        columnName: DATE_JOIN,
        width: getColumnWidth('dateJoin', type),
        align: 'left',
      },
      {
        title: 'Assign To',
        dataIndex: 'assignTo',
        key: 'assignTo',
        render: (assignTo) => (
          <span
            className={styles.renderAssignee}
            onClick={() => this.viewProfile(assignTo?.generalInfo?.userId)}
          >
            {assignTo?.generalInfo?.firstName + assignTo?.generalInfo?.lastName || '-'}
          </span>
        ),
        columnName: ASSIGN_TO,
        width: getColumnWidth('assignTo', type),
        align: 'left',
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
        align: 'left',
      },
      {
        title: 'Status',
        dataIndex: 'processStatus',
        key: 'processStatus',
        render: (processStatus) => <Tag color="geekblue">{processStatus}</Tag>,
        columnName: PROCESS_STATUS_1,
        width: getColumnWidth('processStatus', type),
        align: 'left',
      },
      {
        dataIndex: 'actions',
        key: 'actions',
        width: getColumnWidth('actions', type),
        fixed: 'right',
        align: 'center',
        render: (_, row) => {
          const { currentUser: { employee: { _id: empId = '' } = {} } = {} } = this.props;
          const {
            processStatusId = '',
            rookieId = '',
            assignTo = {},
            assigneeManager = {},
            offerExpiryDate = '',
          } = row;
          const id = rookieId.replace('#', '') || '';

          const checkPermission =
            this.checkPermission('hr-manager') ||
            assignTo._id === empId ||
            assigneeManager._id === empId;

          const payload = {
            id,
            assignToId: assignTo?._id,
            type,
            actionText,
            processStatusId,
            offerExpiryDate,
          };
          if (checkPermission)
            return (
              <Dropdown
                className={styles.menuIcon}
                overlay={this.actionMenu(payload)}
                placement="topLeft"
              >
                <img src={MenuIcon} alt="menu" />
              </Dropdown>
            );
          return '';
        },
        columnName: ACTION,
      },
    ];

    // Filter only columns that are needed
    const newColumns = columns.filter((column) => columnArr.includes(column.columnName));

    return newColumns;
  };

  actionMenu = (payload = {}) => {
    const {
      id = '',
      assignToId: currentEmpId = '',
      type = '',
      actionText = '',
      processStatusId = '',
      offerExpiryDate = '',
    } = payload;

    const {
      PROVISIONAL_OFFER_DRAFT,
      FINAL_OFFERS_DRAFT,

      RENEGOTIATE_PROVISIONAL_OFFERS,
      RENEGOTIATE_FINAL_OFFERS,

      ACCEPTED_PROVISIONAL_OFFERS,

      APPROVED_OFFERS,
      ACCEPTED_FINAL_OFFERS,

      SENT_FINAL_OFFERS,
    } = PROCESS_STATUS;
    const isRemovable =
      processStatusId === PROVISIONAL_OFFER_DRAFT || processStatusId === FINAL_OFFERS_DRAFT;
    const isHRManager = this.checkPermission('hr-manager');

    const isExpired = compare(moment(), moment(offerExpiryDate)) === 1;

    let menuItem = '';
    switch (processStatusId) {
      case PROVISIONAL_OFFER_DRAFT:
        menuItem = (
          <Menu.Item>
            <Link to={`/employee-onboarding/list/review/${id}`} onClick={() => this.fetchData()}>
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
              <Link to={`/employee-onboarding/list/review/${id}`} onClick={() => this.fetchData()}>
                <span>Schedule 1-on-1</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                to={`/employee-onboarding/list/review/${id}`}
                onClick={() => this.fetchData(id)}
              >
                <span className={styles.viewDraft}>View Form</span>
              </Link>
            </Menu.Item>
          </>
        );
        break;

      case ACCEPTED_PROVISIONAL_OFFERS:
        menuItem = (
          <Menu.Item>
            <Link
              to={`/employee-onboarding/list/review/${id}`}
              onClick={() => {
                this.initiateBackgroundCheck(id);
              }}
            >
              <span>Initiate Background Check</span>
            </Link>
          </Menu.Item>
        );
        break;

      case FINAL_OFFERS_DRAFT:
        menuItem = (
          <>
            <Menu.Item>
              <Link
                to={`/employee-onboarding/list/review/${id}`}
                onClick={() => this.fetchData(id)}
              >
                Send for approval
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                to={`/employee-onboarding/list/review/${id}`}
                onClick={() => this.fetchData(id)}
              >
                <span className={styles.viewDraft}>View Form</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                to={`/employee-onboarding/list/review/${id}`}
                onClick={() => this.fetchData(id)}
              >
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
              <Link
                to={`/employee-onboarding/list/review/${id}`}
                onClick={() => this.fetchData(id)}
              >
                Send to candidate
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                to={`/employee-onboarding/list/review/${id}`}
                onClick={() => this.fetchData(id)}
              >
                <span className={styles.viewDraft}>View Form</span>
              </Link>
            </Menu.Item>
          </>
        );
        break;

      case SENT_FINAL_OFFERS:
        menuItem = isExpired ? (
          <>
            <Menu.Item>
              <Link
                to={`/employee-onboarding/list/review/${id}`}
                onClick={() => this.fetchData(id)}
              >
                <span onClick={() => this.handleActionClick(processStatusId)}>{actionText}</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <span onClick={() => this.handleExpiryTicket(id, 'renew', processStatusId, type)}>
                Renew
              </span>
            </Menu.Item>
            <Menu.Item>
              <span onClick={() => this.handleExpiryTicket(id, 'discard', processStatusId, type)}>
                Discard
              </span>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item>
            <Link to={`/employee-onboarding/list/review/${id}`} onClick={() => this.fetchData(id)}>
              <span onClick={() => this.handleActionClick(processStatusId)}>{actionText}</span>
            </Link>
          </Menu.Item>
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
            <Link to={`/employee-onboarding/list/review/${id}`} onClick={() => this.fetchData(id)}>
              <span onClick={() => this.handleActionClick(processStatusId)}>{actionText}</span>
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
                this.handleReassignModal(true, currentEmpId, id, processStatusId, type)
              }
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

  handleExpiryTicket = (id, type, processStatusId, tableType) => {
    if (type === 'renew') {
      this.setState({
        renewModalVisible: true,
        selectedExpiryTicketId: id,
        expiryStatus: processStatusId,
        expiryType: tableType,
      });
    }
    if (type === 'discard') {
      this.discardOffer(id, tableType, processStatusId);
    }
  };

  // discard offer
  discardOffer = async (id, tableType, processStatusId) => {
    const { dispatch } = this.props;
    const { pageSelected, size } = this.props;

    await dispatch({
      type: 'onboard/handleExpiryTicket',
      payload: {
        id,
        tenantId: getCurrentTenant(),
        type: 2, // discard
        isAll: tableType === 'ALL',
        processStatus: processStatusId,
        page: pageSelected,
        limit: size,
      },
    });
  };

  handleRenewModal = (value) => {
    this.setState({
      renewModalVisible: value,
    });
  };

  viewProfile = (_id) => {
    history.push(`/directory/employee-profile/${_id}`);
  };

  render() {
    const { list = [], pageSelected, size, getPageAndSize, total: totalData } = this.props;

    const {
      reassignModalVisible = false,
      currentEmpId = '',
      reassignTicketId = '',
      reassignStatus = '',
      reassignType = '',
      selectedExpiryTicketId,
      renewModalVisible,
      expiryStatus,
      expiryType,
    } = this.state;

    const rowSelection = {
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
            size="middle"
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
            // scroll={list.length > 0 ? { x: '80vw', y: 'max-content' } : {}}
          />
        </div>
        {/* <CustomModal
          open={openModal}
          width={590}
          closeModal={this.closeModal}
          content={this.getModalContent()}
        /> */}
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
        <RenewModal
          visible={renewModalVisible}
          ticketId={selectedExpiryTicketId}
          handleRenewModal={this.handleRenewModal}
          processStatus={expiryStatus}
          type={expiryType}
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
