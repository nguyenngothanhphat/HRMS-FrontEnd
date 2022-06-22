import React, { Component } from 'react';
import { Table, Empty, Dropdown, Menu, Popover } from 'antd';
import { formatMessage, Link, connect, history } from 'umi';
import moment from 'moment';
import MenuIcon from '@/assets/projectManagement/actionIcon.svg';
import {
  NEW_PROCESS_STATUS,
  ONBOARDING_FORM_LINK,
  ONBOARDING_FORM_STEP_LINK,
} from '@/utils/onboarding';
import { getAuthority, getCurrentTenant } from '@/utils/authority';
import { getTimezoneViaCity } from '@/utils/times';
import AcceptIcon from '@/assets/Accept-icon-onboarding.svg';
import MessageIcon from '@/assets/message.svg';

import { COLUMN_NAME, TABLE_TYPE } from '../utils';
import { getActionText, getColumnWidth } from './utils';
import ReassignModal from './components/ReassignModal';
import RenewModal from './components/RenewModal';
import PopupContentHr from './components/PopupContentHr';
import JoiningFormalitiesModal from './components/JoiningFormalitiesModal';

import styles from './index.less';
import CandidateUserName from './components/CandidateUserName/index';
import ConfirmModal from './components/ConfirmModal/index';

import EyeIcon from '@/assets/eyes.svg';
// import JoiningIcon from '@/assets/Vector.svg';
// import LaunchIcon from '@/assets/launchIcon.svg';
import DeleteIcon from '@/assets/bin.svg';

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
      reassignModalVisible: false,
      currentEmpId: '',
      currentEmpName: '',
      reassignTicketId: '',
      reassignStatus: '',
      reassignType: '',

      // expiry tickets
      renewModalVisible: false,
      selectedExpiryTicketId: '',
      expiryStatus: '',
      expiryType: '',

      // Joining Formalities
      openModalName: '',
      dateJoinCandidate: '',
      selectedCandidateId: '',

      // popup hover name
      timezoneList: [],
      currentTime: moment(),
    };
  }

  componentDidMount() {
    this.fetchTimezone();
    this.setCurrentTime();
  }

  componentDidUpdate(prevProps) {
    const { companyLocationList = [] } = this.props;
    if (JSON.stringify(prevProps.companyLocationList) !== JSON.stringify(companyLocationList)) {
      this.fetchTimezone();
    }
  }

  setCurrentTime = () => {
    // compare two time by hour & minute. If minute changes, get new time
    const timeFormat = 'HH:mm';
    const { currentTime } = this.state;
    const parseTime = (timeString) => moment(timeString, timeFormat);
    const check = parseTime(moment().format(timeFormat)).isAfter(
      parseTime(moment(currentTime).format(timeFormat)),
    );

    if (check) {
      this.setState({
        currentTime: moment(),
      });
    }
  };

  fetchTimezone = () => {
    const { companyLocationList = [] } = this.props;
    const timezoneList = [];
    companyLocationList.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timezoneList.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    this.setState({
      timezoneList,
    });
  };

  handleActionDelete = (id, processStatus) => {
    const { dispatch } = this.props;

    if (!dispatch) {
      return;
    }

    dispatch({
      type: 'onboarding/deleteTicketDraft',
      payload: {
        id,
        tenantId: getCurrentTenant(),
      },
      processStatus,
    });
  };

  handleActionWithDraw = (candidate, processStatus) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'onboarding/withdrawTicket',
      payload: {
        candidate,
      },
      processStatus,
    });
  };

  renderCandidateId = (candidateId = '', row) => {
    const id = candidateId.replace('#', '') || '';
    const { currentStep = 0 } = row;
    const find = ONBOARDING_FORM_STEP_LINK.find((v) => v.id === currentStep) || {
      link: ONBOARDING_FORM_LINK.BASIC_INFORMATION,
    };
    return (
      <Link className={styles.candidateId} to={`/onboarding/list/view/${id}/${find.link}`}>
        <span>{candidateId}</span>
      </Link>
    );
  };

  renderNotice = (selectedPerson) => {
    const { activeConversationUnseen } = this.props;

    const isNotice = activeConversationUnseen.some(
      (item) => item.candidateId === selectedPerson.candidateId.replace('#', ''),
    );

    return (
      isNotice && (
        <span className={styles.notice}>
          <img alt="message-icon" src={MessageIcon} />
        </span>
      )
    );
  };

  renderName = (id) => {
    const { list } = this.props;
    const selectedPerson = list.find((item) => item.candidateId === id);
    const {
      candidateName: name = '',
      isNew,
      offerExpiryDate = '',
      processStatusId,
    } = selectedPerson;
    const isExpired = compare(moment(), moment(offerExpiryDate)) === 1;

    if (isExpired) {
      return (
        <p>
          {name && <span className={styles.name}>{name}</span>}
          <span className={styles.expired}>Expired</span>
          {this.renderNotice(selectedPerson)}
        </p>
      );
    }
    if (
      isNew &&
      processStatusId !== NEW_PROCESS_STATUS.OFFER_ACCEPTED &&
      processStatusId !== NEW_PROCESS_STATUS.JOINED
    ) {
      return (
        <p>
          {name && <span className={styles.name}>{name}</span>}
          <span className={styles.new}>
            {formatMessage({ id: 'component.onboardingOverview.new' })}
          </span>
          {this.renderNotice(selectedPerson)}
        </p>
      );
    }

    if (
      processStatusId === NEW_PROCESS_STATUS.OFFER_ACCEPTED ||
      processStatusId === NEW_PROCESS_STATUS.JOINED
    ) {
      return (
        <p>
          {name && <span className={styles.name}>{name}</span>}
          <span>
            <img alt="accepted-icon" src={AcceptIcon} />
          </span>
          {this.renderNotice(selectedPerson)}
        </p>
      );
    }

    return (
      <p>
        {name || '-'}
        {this.renderNotice(selectedPerson)}
      </p>
    );
  };

  initiateBackgroundCheck = (id) => {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'onboard/initiateBackgroundCheckEffect',
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

  getColorClassName = (type = 'A') => {
    const tempType = type.toLowerCase().replace(/ +/g, '');
    if (tempType === 'draft' || tempType === 'needchanges') {
      return styles.blueTag;
    }
    if (tempType === 'offerreleased' || tempType === 'offeraccepted' || tempType === 'joined') {
      return styles.greenTag;
    }
    if (tempType === 'offerrejected' || tempType === 'offerwithdrawn') {
      return styles.redTag;
    }
    return styles.yellowTag;
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

    const { list = [], companyLocationList = [] } = this.props;
    const { timezoneList, currentTime } = this.state;

    const columns = [
      {
        // title: 'Rookie Id',
        title: formatMessage({ id: 'component.onboardingOverview.candidateId' }),
        dataIndex: 'candidateId',
        key: 'candidateId',
        width: getColumnWidth('candidateId', type, list.length),
        render: (candidateId = '', row) => this.renderCandidateId(candidateId, row),
        columnName: ID,
        fixed: 'left',
      },
      {
        // title: 'Rookie Name',
        title: formatMessage({ id: 'component.onboardingOverview.candidateName' }),
        dataIndex: 'candidateId',
        key: 'candidateID2',
        render: (candidateId) => this.renderName(candidateId),
        columnName: NAME,
        width: getColumnWidth('candidateName', type, list.length),
        align: 'left',
      },
      {
        // title: 'Position',
        title: formatMessage({ id: 'component.onboardingOverview.position' }),
        dataIndex: 'position',
        key: 'position',
        render: (position) => <span className={styles.position}>{position || '-'}</span>,
        columnName: POSITION,
        width: getColumnWidth('position', type, list.length),
        align: 'left',
      },
      {
        // title: 'Date of Joining',
        title: formatMessage({ id: 'component.onboardingOverview.dateJoin' }),
        dataIndex: 'dateJoin',
        key: 'dateJoin',
        render: (dateJoin) => <span className={styles.dateJoin}>{dateJoin || '-'}</span>,
        columnName: DATE_JOIN,
        width: getColumnWidth('dateJoin', type, list.length),
        align: 'left',
      },
      {
        // title: 'Location',
        title: formatMessage({ id: 'component.onboardingOverview.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (location) => <span className={styles.location}>{location || '-'}</span>,
        columnName: LOCATION,
        width: getColumnWidth('location', type, list.length),
        align: 'left',
      },
      {
        title: 'Assigned to',
        dataIndex: 'assignTo',
        key: 'assignTo',
        render: (assignTo) => (
          <Popover
            content={
              <PopupContentHr
                companyLocationList={companyLocationList}
                propsState={{ currentTime, timezoneList }}
                dataHR={assignTo}
              />
            }
            trigger="hover"
            placement="bottomRight"
            overlayClassName={styles.popupContentHr}
          >
            <span
              className={styles.renderAssignee}
              onClick={() => this.viewProfile(assignTo?.generalInfo?.userId)}
            >
              {assignTo?.generalInfo?.legalName || '-'}
            </span>
          </Popover>
        ),
        columnName: ASSIGN_TO,
        width: getColumnWidth('assignTo', type, list.length),
        align: 'left',
      },
      {
        title: 'HR Manager',
        dataIndex: 'assigneeManager',
        key: 'assigneeManager',
        render: (assigneeManager) => (
          <Popover
            content={
              <PopupContentHr
                companyLocationList={companyLocationList}
                propsState={{ currentTime, timezoneList }}
                dataHR={assigneeManager}
              />
            }
            trigger="hover"
            placement="bottomRight"
            overlayClassName={styles.popupContentHr}
          >
            <span
              className={styles.renderAssignee}
              onClick={() => this.viewProfile(assigneeManager?.generalInfo?.userId)}
            >
              {assigneeManager?.generalInfo?.legalName || '-'}
            </span>
          </Popover>
        ),
        columnName: ASSIGNEE_MANAGER,
        width: getColumnWidth('assigneeManager', type, list.length),
        align: 'left',
      },
      {
        title: 'Status',
        dataIndex: 'processStatus',
        key: 'processStatus',
        render: (processStatus) => (
          <span
            className={`${this.getColorClassName(processStatus)}
              ${styles.processStatus}
            `}
          >
            {processStatus}
          </span>
        ),
        columnName: PROCESS_STATUS_1,
        width: getColumnWidth('processStatus', type, list.length),
        align: 'left',
        fixed: 'right',
      },
      {
        dataIndex: 'actions',
        key: 'actions',
        width: getColumnWidth('actions', type, list.length),
        fixed: 'right',
        align: 'center',
        render: (_, row) => {
          const { currentUser: { employee: { _id: empId = '' } = {} } = {} } = this.props;
          const {
            processStatusId = '',
            candidateId = '',
            assignTo = {},
            assigneeManager = {},
            offerExpiryDate = '',
            candidate = '',
            currentStep = 0,
            dateJoin = '',
          } = row;

          const actionText = getActionText(type, processStatusId);

          const id = candidateId.replace('#', '') || '';

          const checkPermission =
            this.checkPermission('hr-manager') ||
            assignTo._id === empId ||
            assigneeManager._id === empId;

          const payload = {
            id,
            assignToId: assignTo?._id,
            assignToName: assignTo?.generalInfo?.legalName,
            type,
            actionText,
            processStatusId,
            offerExpiryDate,
            currentStep,
            dateJoin,
          };
          if (checkPermission)
            return (
              <Dropdown
                className={styles.menuIcon}
                overlay={this.actionMenu(payload, candidate)}
                placement="bottomRight"
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

  actionMenu = (payload = {}, candidate) => {
    const {
      id = '',
      assignToId: currentEmpId = '',
      assignToName: currentEmpName = '',
      type = '',
      actionText = '',
      processStatusId = '',
      offerExpiryDate = '',
      currentStep = 0,
      dateJoin = '',
    } = payload;

    const { DRAFT, OFFER_RELEASED, OFFER_ACCEPTED, JOINED } = NEW_PROCESS_STATUS; // new status

    const isRemovable = processStatusId === DRAFT;
    const isHRManager = this.checkPermission('hr-manager');
    const find = ONBOARDING_FORM_STEP_LINK.find((v) => v.id === currentStep) || {
      link: ONBOARDING_FORM_LINK.BASIC_INFORMATION,
    };

    const isExpired = compare(moment(), moment(offerExpiryDate)) === 1;
    let menuItem = '';

    switch (processStatusId) {
      case OFFER_RELEASED:
        menuItem = isExpired ? (
          <>
            <Menu.Item>
              <Link to={`/onboarding/list/view/${id}`}>
                <span>{actionText}</span>
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
            <Link to={`/onboarding/list/view/${id}`}>
              <span>{actionText}</span>
            </Link>
          </Menu.Item>
        );

        break;

      case OFFER_ACCEPTED:
        menuItem = (
          <>
            <Menu.Item>
              <Link className={styles.actionText} to={`/onboarding/list/view/${id}/${find.link}`}>
                <img className={styles.actionIcon} src="JoiningIcon" alt="joiningIcon" />
                <span>Send Pre-Joining Documents</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link className={styles.actionText} to={`/onboarding/list/view/${id}/${find.link}`}>
                <img className={styles.actionIcon} src={EyeIcon} alt="eyesIcon" />
                <span>{actionText}</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <img className={styles.actionIcon} src="LaunchIcon" alt="launchIcon" />
              <span
                onClick={() =>
                  this.handleOpenJoiningFormalitiesModal('initiate', dateJoin, candidate)}
              >
                Initiate joining formalities
              </span>
            </Menu.Item>
          </>
        );
        break;
      default:
        menuItem = (
          <Menu.Item>
            <Link className={styles.actionText} to={`/onboarding/list/view/${id}/${find.link}`}>
              <span>{actionText}</span>
            </Link>
          </Menu.Item>
        );
        break;
    }

    return (
      <Menu className={styles.menu}>
        {menuItem}
        {isHRManager && processStatusId !== OFFER_ACCEPTED && processStatusId !== JOINED && (
          <Menu.Item>
            <div
              onClick={() =>
                this.handleReassignModal(
                  true,
                  currentEmpId,
                  currentEmpName,
                  id,
                  processStatusId,
                  type,
                )}
              className={styles.actionText}
            >
              Re-assign
            </div>
          </Menu.Item>
        )}
        {isRemovable && (
          <Menu.Item disabled={!isRemovable}>
            <div
              className={styles.actionText}
              onClick={isRemovable ? () => this.handleActionDelete(id, processStatusId) : () => {}}
            >
              Delete
            </div>
          </Menu.Item>
        )}
        {!isRemovable && processStatusId !== JOINED && (
          <Menu.Item>
            <img className={styles.actionIcon} src={DeleteIcon} alt="deleteIcon" />
            <span
              onClick={
                !isRemovable
                  ? () => this.handleActionWithDraw(candidate, processStatusId)
                  : () => {}
              }
              className={styles.actionText}
            >
              Withdraw
            </span>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  // JoiningFormalitiesModal
  handleOpenJoiningFormalitiesModal = (value, dateJoin = '', selectedId = '') => {
    this.setState({
      openModalName: value,
      dateJoinCandidate: dateJoin,
      selectedCandidateId: selectedId,
    });
  };

  cancelJoiningFormalities = () => {
    this.setState({
      openModalName: '',
      dateJoinCandidate: '',
      selectedCandidateId: '',
    });
  };

  onConvertEmployee = () => {
    this.setState({
      openModalName: 'username',
    });
  };

  // userName modal
  cancelCandidateUserName = () => {
    this.setState({
      openModalName: 'initiate',
    });
  };

  onSubmitUserName = () => {
    this.setState({
      openModalName: 'detail',
    });
  };

  // detail infor candidate modal
  onMaybeLater = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/save',
      payload: { reloadTableData: true },
    });
    this.setState({
      openModalName: '',
    });
  };

  // end

  handleReassignModal = (value, currentEmpId, currentEmpName, id, processStatusId, type) => {
    this.setState({
      reassignModalVisible: value,
      currentEmpId,
      currentEmpName,
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
      type: 'onboarding/handleExpiryTicket',
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
      dateJoinCandidate,
      selectedCandidateId,
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
          {formatMessage({ id: 'component.directory.pagination.showing' })}
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

    const { columnArr, type, inTab, hasCheckbox, loading, loadingFetch, loadingSearch } =
      this.props;
    const { openModalName, currentEmpName } = this.state;

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
            loading={loading || loadingFetch || loadingSearch}
            pagination={pagination}
            scroll={list.length > 0 ? { x: '90vw', y: 'max-content' } : {}}
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
          currentEmpName={currentEmpName}
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
        <JoiningFormalitiesModal
          visible={openModalName === 'initiate'}
          onCancel={this.cancelJoiningFormalities}
          onOk={this.onConvertEmployee}
          candidate={{ dateOfJoining: dateJoinCandidate, candidateId: selectedCandidateId }}
        />
        <CandidateUserName
          visible={openModalName === 'username'}
          onCancel={this.cancelCandidateUserName}
          onOk={this.onSubmitUserName}
          candidateId={selectedCandidateId}
        />
        <ConfirmModal
          visible={openModalName === 'detail'}
          onCancel={this.onMaybeLater}
          onOk={this.onMaybeLater}
        />
      </>
    );
  }
}

// export default OnboardTable;
export default connect(
  ({
    newCandidateForm,
    loading,
    user: { currentUser = {} } = {},
    location: { companyLocationList = [] },
    conversation: { activeConversationUnseen = [] },
  }) => ({
    isAddNewMember: newCandidateForm.isAddNewMember,
    loading: loading.effects['onboard/fetchOnboardList'],
    currentUser,
    companyLocationList,
    activeConversationUnseen,
  }),
)(OnboardTable);
