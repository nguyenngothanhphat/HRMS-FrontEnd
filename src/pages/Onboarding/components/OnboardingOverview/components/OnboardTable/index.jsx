import { Dropdown, Empty, Menu } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, formatMessage, history, Link } from 'umi';
import AcceptIcon from '@/assets/Accept-icon-onboarding.svg';
import MessageIcon from '@/assets/message.svg';
import MenuIcon from '@/assets/projectManagement/actionIcon.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import UserProfilePopover from '@/components/UserProfilePopover';
import {
  NEW_PROCESS_STATUS,
  NEW_PROCESS_STATUS_TABLE_NAME,
  ONBOARDING_COLUMN_NAME,
  ONBOARDING_FORM_LINK,
  ONBOARDING_FORM_STEP_LINK,
} from '@/constants/onboarding';
import { getAuthority, getCurrentTenant } from '@/utils/authority';
import {
  compare,
  dateDiffInDays,
  formatDate,
  getActionText,
  getColumnWidth,
} from '@/utils/onboarding';
import ConfirmModal from './components/ConfirmModal/index';
import JoiningFormalitiesModal from './components/JoiningFormalitiesModal';
import ReassignModalContent from './components/ReassignModalContent';
import RenewModal from './components/RenewModal';
import styles from './index.less';
import WithdrawOfferModal from '@/pages/NewCandidateForm/components/PreviewOffer/components/WithdrawOfferModal';

const OnboardTable = (props) => {
  const {
    dispatch,
    list = [],
    page = 1,
    limit = 10,
    total,
    onChangePage = () => {},
    loadingReassign = false,
    loading = false,
    loadingFetch = false,
    loadingSearch = false,
    loadingWithdrawOffer = false,
    documentChecklist,
    activeConversationUnseen,
    activeTab = {},
    refreshData = () => {},
    currentUser: { employee: { _id: empId = '' } = {} } = {},
  } = props;

  const [reassignModalVisible, setReassignModalVisible] = useState(false);
  const [renewModalVisible, setRenewModalVisible] = useState(false);
  const [openModalName, setOpenModalName] = useState('');
  const [handlingRecord, setHandlingRecord] = useState();

  const viewProfile = (_id) => {
    history.push(`/directory/employee-profile/${_id}`);
  };

  const handleActionDelete = async (id) => {
    if (!dispatch) {
      return;
    }

    const res = await dispatch({
      type: 'onboarding/deleteTicketDraft',
      payload: {
        id,
        tenantId: getCurrentTenant(),
      },
    });
    if (res.statusCode === 200) {
      refreshData();
    }
  };

  const handleWithdrawOffer = async (reason) => {
    const res = await dispatch({
      type: 'onboarding/withdrawTicket',
      payload: {
        candidate: handlingRecord?._id,
        reasonForWithdraw: reason,
      },
    });
    if (res.statusCode === 200) {
      setOpenModalName('');
      refreshData();
    }
  };

  const handleActionWithDraw = (row) => {
    setHandlingRecord(row);
    setOpenModalName('withdraw');
  };

  const renderCandidateId = (candidateId = '', row) => {
    const id = candidateId.replace('#', '') || '';
    const { currentStep = 0 } = row;
    const find = ONBOARDING_FORM_STEP_LINK.find((v) => v.id === currentStep) || {
      link: ONBOARDING_FORM_LINK.BASIC_INFORMATION,
    };
    return (
      <Link className={styles.candidateId} to={`/onboarding/list/view/${id}/${find.link}`}>
        <span>#{candidateId}</span>
      </Link>
    );
  };

  const renderNotice = (candidateId) => {
    const isNotice = activeConversationUnseen.some((item) => item.candidateId === candidateId);

    return (
      isNotice && (
        <span className={styles.notice}>
          <img alt="message-icon" src={MessageIcon} />
        </span>
      )
    );
  };

  const renderName = (record) => {
    const {
      expiryDate = '',
      processStatus = '',
      firstName = '',
      lastName = '',
      middleName = '',
      ticketID = '',
      updatedAt = '',
    } = record;

    const fullName = `${firstName ? `${firstName} ` : ''}${middleName ? `${middleName} ` : ''}${
      lastName ? `${lastName} ` : ''
    }`;

    const isNew = dateDiffInDays(Date.now(), updatedAt) < 3;

    const isExpired = compare(moment(), moment(expiryDate)) === 1;

    if (isExpired) {
      return (
        <p>
          {fullName && <span className={styles.name}>{fullName}</span>}
          <span className={styles.expired}>Expired</span>
          {renderNotice(ticketID)}
        </p>
      );
    }
    if (
      isNew &&
      processStatus !== NEW_PROCESS_STATUS.OFFER_ACCEPTED &&
      processStatus !== NEW_PROCESS_STATUS.JOINED
    ) {
      return (
        <p>
          {fullName && <span className={styles.name}>{fullName}</span>}
          <span className={styles.new}>
            {formatMessage({ id: 'component.onboardingOverview.new' })}
          </span>
          {renderNotice(ticketID)}
        </p>
      );
    }

    if (
      processStatus === NEW_PROCESS_STATUS.OFFER_ACCEPTED ||
      processStatus === NEW_PROCESS_STATUS.JOINED
    ) {
      return (
        <p>
          {fullName && <span className={styles.name}>{fullName}</span>}
          <span>
            <img alt="accepted-icon" src={AcceptIcon} />
          </span>
          {renderNotice(ticketID)}
        </p>
      );
    }

    return (
      <p>
        {fullName || '-'}
        {renderNotice(ticketID)}
      </p>
    );
  };

  const checkPermissionFunc = (role) => {
    const getAuth = getAuthority();
    let check = false;
    getAuth.forEach((item) => {
      if (item.toLowerCase().includes(role)) {
        check = true;
      }
    });
    return check;
  };

  const getColorClassName = (typeProp = 'A') => {
    const tempType = typeProp.toLowerCase().replace(/ +/g, '');
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

  const dataHover = (data) => {
    return {
      ...data,
      locationInfo: data?.location,
    };
  };

  // discard offer
  const discardOffer = async (row = {}) => {
    await dispatch({
      type: 'onboarding/handleExpiryTicket',
      payload: {
        id: row.ticketID,
        tenantId: getCurrentTenant(),
        type: 2, // discard
      },
    });
  };

  const handleExpiryTicket = (typeProp, row = {}) => {
    if (typeProp === 'renew') {
      setRenewModalVisible(true);
      setHandlingRecord(row);
    }
    if (typeProp === 'discard') {
      discardOffer(row);
    }
  };

  const handleSendPreJoining = (ticketID, candidate) => {
    dispatch({
      type: 'newCandidateForm/sendCheckListEffect',
      payload: {
        processStatus: NEW_PROCESS_STATUS.DOCUMENT_CHECKLIST_VERIFICATION,
        currentStep: 8,
        documentChecklist,
        rookieId: ticketID,
        candidate,
      },
    }).then((data) => {
      const { statusCode } = data;
      if (statusCode === 200) {
        refreshData();
      }
    });
  };

  const handleReassignModal = (row) => {
    setReassignModalVisible(true);
    setHandlingRecord(row);
  };

  const handleRenewModal = (value) => {
    setRenewModalVisible(value);
  };

  // JoiningFormalitiesModal
  const handleOpenJoiningFormalitiesModal = (value, row) => {
    setOpenModalName(value);
    setHandlingRecord(row);
  };

  const cancelJoiningFormalities = () => {
    setOpenModalName('');
    setHandlingRecord({});
  };

  // userName modal
  const cancelCandidateUserName = () => {
    setOpenModalName('initiate');
  };

  const onSubmitUserName = () => {
    setOpenModalName('detail');
  };

  // detail info candidate modal
  const onMaybeLater = () => {
    dispatch({
      type: 'onboarding/save',
      payload: { reloadTableData: true },
    });
    setOpenModalName('');
  };

  const actionMenu = (row = {}) => {
    const { processStatus = '', ticketID = '', expiryDate = '', _id = '', currentStep = 0 } = row;

    const actionText = getActionText(activeTab.id, processStatus);

    const { DRAFT, OFFER_RELEASED, OFFER_ACCEPTED, JOINED, OFFER_WITHDRAWN } = NEW_PROCESS_STATUS; // new status

    const isRemovable = processStatus === DRAFT;

    const find = ONBOARDING_FORM_STEP_LINK.find((v) => v.id === currentStep) || {
      link: ONBOARDING_FORM_LINK.BASIC_INFORMATION,
    };

    const isExpired = compare(moment(), moment(expiryDate)) === 1;
    const isHRManager = checkPermissionFunc('hr-manager');

    let menuItem = '';

    switch (processStatus) {
      case OFFER_RELEASED:
        menuItem = isExpired ? (
          <>
            <Menu.Item>
              <Link to={`/onboarding/list/view/${_id}`}>
                <span>{actionText}</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <span onClick={() => handleExpiryTicket('renew', row)}>Renew</span>
            </Menu.Item>
            <Menu.Item>
              <span onClick={() => handleExpiryTicket('discard', row)}>Discard</span>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item>
            <Link to={`/onboarding/list/view/${_id}`}>
              <span>{actionText}</span>
            </Link>
          </Menu.Item>
        );

        break;

      case OFFER_ACCEPTED:
        menuItem = (
          <>
            <Menu.Item>
              <Link
                className={styles.actionText}
                onClick={() => handleSendPreJoining(ticketID, _id, processStatus)}
                to="#"
              >
                <span>Send Pre-Joining Documents</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link className={styles.actionText} to={`/onboarding/list/view/${_id}/${find.link}`}>
                <span>{actionText}</span>
              </Link>
            </Menu.Item>
          </>
        );
        break;

      case JOINED:
        menuItem = (
          <>
            <Menu.Item>
              <Link className={styles.actionText} to={`/onboarding/list/view/${_id}/${find.link}`}>
                <span>{actionText}</span>
              </Link>
            </Menu.Item>
            <Menu.Item onClick={() => handleOpenJoiningFormalitiesModal('initiate', row)}>
              <span>Initiate joining formalities</span>
            </Menu.Item>
          </>
        );
        break;
      default:
        menuItem = (
          <Menu.Item>
            <Link className={styles.actionText} to={`/onboarding/list/view/${_id}/${find.link}`}>
              <span>{actionText}</span>
            </Link>
          </Menu.Item>
        );
        break;
    }

    return (
      <Menu className={styles.menu}>
        {menuItem}
        {isHRManager &&
          processStatus !== OFFER_ACCEPTED &&
          processStatus !== JOINED &&
          processStatus !== OFFER_WITHDRAWN && (
            <Menu.Item>
              <div onClick={() => handleReassignModal(row)} className={styles.actionText}>
                Re-assign
              </div>
            </Menu.Item>
          )}
        {isRemovable && (
          <Menu.Item disabled={!isRemovable}>
            <div
              className={styles.actionText}
              onClick={isRemovable ? () => handleActionDelete(_id, processStatus) : () => {}}
            >
              Delete
            </div>
          </Menu.Item>
        )}
        {!isRemovable && processStatus !== JOINED && processStatus !== OFFER_WITHDRAWN && (
          <Menu.Item>
            <span
              onClick={!isRemovable ? () => handleActionWithDraw(row) : () => {}}
              className={styles.actionText}
            >
              Withdraw
            </span>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const generateColumns = () => {
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
    } = ONBOARDING_COLUMN_NAME;

    const columns = [
      {
        // title: 'Rookie Id',
        title: formatMessage({ id: 'component.onboardingOverview.candidateId' }),
        dataIndex: 'ticketID',
        key: 'ticketID',
        width: getColumnWidth('candidateId', activeTab.id, list.length),
        render: (ticketID = '', row) => renderCandidateId(ticketID, row),
        columnName: ID,
        fixed: 'left',
      },
      {
        // title: 'Rookie Name',
        title: formatMessage({ id: 'component.onboardingOverview.candidateName' }),
        dataIndex: 'candidateId',
        key: 'candidateID2',
        render: (_, row) => renderName(row),
        columnName: NAME,
        width: getColumnWidth('candidateName', activeTab.id, list.length),
        align: 'left',
      },
      {
        // title: 'Position',
        title: formatMessage({ id: 'component.onboardingOverview.position' }),
        dataIndex: 'title',
        key: 'title',
        render: (title) => <span className={styles.position}>{title?.name || '-'}</span>,
        columnName: POSITION,
        width: getColumnWidth('position', activeTab.id, list.length),
        align: 'left',
      },
      {
        // title: 'Date of Joining',
        title: formatMessage({ id: 'component.onboardingOverview.dateJoin' }),
        dataIndex: 'dateOfJoining',
        key: 'dateOfJoining',
        render: (dateOfJoining) => (
          <span className={styles.dateJoin}>{formatDate(dateOfJoining) || '-'}</span>
        ),
        columnName: DATE_JOIN,
        width: getColumnWidth('dateJoin', activeTab.id, list.length),
        align: 'left',
      },
      {
        // title: 'Location',
        title: formatMessage({ id: 'component.onboardingOverview.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (_, row) => {
          const { workLocation, clientLocation, workFromHome } = row;
          const location = workLocation
            ? workLocation.name
            : clientLocation || (workFromHome && 'Work From Home');

          return <span className={styles.location}>{location || '-'}</span>;
        },
        columnName: LOCATION,
        width: getColumnWidth('location', activeTab.id, list.length),
        align: 'left',
      },
      {
        title: 'Assigned to',
        dataIndex: 'assignTo',
        key: 'assignTo',
        render: (assignTo) => (
          <UserProfilePopover data={dataHover(assignTo)} placement="bottomRight">
            <span
              className={styles.renderAssignee}
              onClick={() => viewProfile(assignTo?.generalInfo?.userId)}
            >
              {assignTo?.generalInfo?.legalName || '-'}
            </span>
          </UserProfilePopover>
        ),
        columnName: ASSIGN_TO,
        width: getColumnWidth('assignTo', activeTab.id, list.length),
        align: 'left',
      },
      {
        title: 'HR Manager',
        dataIndex: 'assigneeManager',
        key: 'assigneeManager',
        render: (assigneeManager) => (
          <UserProfilePopover data={dataHover(assigneeManager)} placement="bottomRight">
            <span
              className={styles.renderAssignee}
              onClick={() => viewProfile(assigneeManager?.generalInfo?.userId)}
            >
              {assigneeManager?.generalInfo?.legalName || '-'}
            </span>
          </UserProfilePopover>
        ),
        columnName: ASSIGNEE_MANAGER,
        width: getColumnWidth('assigneeManager', activeTab.id, list.length),
        align: 'left',
      },
      {
        title: 'Status',
        dataIndex: 'processStatus',
        key: 'processStatus',
        render: (processStatus = '') => {
          const statusName = NEW_PROCESS_STATUS_TABLE_NAME[processStatus];
          return (
            <span
              className={`${getColorClassName(statusName)}
              ${styles.processStatus}
            `}
            >
              {statusName}
            </span>
          );
        },
        columnName: PROCESS_STATUS_1,
        width: getColumnWidth('processStatus', activeTab.id, list.length),
        align: 'left',
        fixed: 'right',
      },
      {
        dataIndex: 'actions',
        key: 'actions',
        width: getColumnWidth('actions', activeTab.id, list.length),
        fixed: 'right',
        align: 'center',
        render: (_, row) => {
          const { assignTo = {}, assigneeManager = {} } = row;

          const checkPermission =
            assignTo?._id === empId ||
            assigneeManager?._id === empId ||
            checkPermissionFunc('hr-manager');

          if (!checkPermission) return '';
          return (
            <Dropdown className={styles.menuIcon} overlay={actionMenu(row)} placement="bottomRight">
              <img src={MenuIcon} alt="menu" />
            </Dropdown>
          );
        },
        columnName: ACTION,
      },
    ];

    // Filter only columns that needed
    const newColumns = columns.filter((column) =>
      (activeTab?.columns || []).includes(column.columnName),
    );
    return newColumns;
  };

  return (
    <>
      <div className={styles.OnboardTable}>
        <CommonTable
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
          columns={generateColumns()}
          list={list}
          loading={loading || loadingFetch || loadingSearch}
          scrollable
          width="90vw"
          height={500}
          page={page}
          limit={limit}
          total={total}
          onChangePage={onChangePage}
          isBackendPaging
        />
      </div>

      <CommonModal
        visible={reassignModalVisible}
        title="Re-assign Employee"
        onClose={() => {
          setReassignModalVisible(false);
          setHandlingRecord(null);
        }}
        width={500}
        firstText="Add"
        loading={loadingReassign}
        content={
          <ReassignModalContent
            item={handlingRecord}
            onClose={() => {
              setReassignModalVisible(false);
              setHandlingRecord(null);
            }}
            visible={reassignModalVisible}
            refreshData={refreshData}
          />
        }
      />

      <RenewModal
        visible={renewModalVisible}
        handleRenewModal={handleRenewModal}
        item={handlingRecord}
        refreshData={refreshData}
      />
      <JoiningFormalitiesModal
        visible={openModalName === 'initiate'}
        onOk={onSubmitUserName}
        candidate={handlingRecord}
        onClose={cancelJoiningFormalities}
      />
      <ConfirmModal
        visible={openModalName === 'detail'}
        onCancel={cancelCandidateUserName}
        onOk={onMaybeLater}
        onClose={cancelJoiningFormalities}
      />
      {openModalName === 'withdraw' && (
        <WithdrawOfferModal
          title="Offer Withdraw"
          visible={openModalName === 'withdraw'}
          onClose={() => setOpenModalName('')}
          loading={loadingWithdrawOffer}
          onFinish={handleWithdrawOffer}
        />
      )}
    </>
  );
};

export default connect(
  ({
    newCandidateForm,
    loading,
    user: { currentUser = {} } = {},
    location: { companyLocationList = [] },
    conversation: { activeConversationUnseen = [] },
    newCandidateForm: { tempData: { documentChecklist = [] } = {} } = {},
  }) => ({
    isAddNewMember: newCandidateForm.isAddNewMember,
    loading: loading.effects['onboarding/fetchOnboardList'],
    loadingReassign: loading.effects['onboarding/reassignTicket'],
    loadingWithdrawOffer: loading.effects['onboarding/withdrawTicket'],
    currentUser,
    documentChecklist,
    companyLocationList,
    activeConversationUnseen,
  }),
)(OnboardTable);
