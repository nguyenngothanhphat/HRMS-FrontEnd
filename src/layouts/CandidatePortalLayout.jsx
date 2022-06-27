import { Breadcrumb, Button, Dropdown, Layout, Menu, Result, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history, Link } from 'umi';
import avtDefault from '@/assets/avtDefault.jpg';
import CalendarIcon from '@/assets/candidatePortal/leave-application.svg';
import MessageIcon from '@/assets/candidatePortal/message-circle.svg';
import Footer from '@/components/Footer';
// import BottomBar from '../components/BottomBar';
import CommonModal from '@/pages/CandidatePortal/components/Dashboard/components/CommonModal';
import { getCurrentCompany, getFirstChangePassword } from '@/utils/authority';
import Authorized from '@/utils/Authorized';
import { CANDIDATE_TASK_LINK, CANDIDATE_TASK_STATUS } from '@/utils/candidatePortal';
import { ChatEvent, socket, disconnectSocket } from '@/utils/socket';
import { getAuthorityFromRouter } from '@/utils/utils';
import s from './CandidatePortalLayout.less';

const { Header, Content } = Layout;

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/login">Go Login</Link>
      </Button>
    }
  />
);

const CandidatePortalLayout = React.memo((props) => {
  const {
    children,
    location = {
      pathname: '/',
    },
    route: { routes } = {},
    dispatch,
    companiesOfUser = [],
    candidate = '',
    loadingFetchCurrent = false,
    ticketId = '',
    // data: { title: { name: titleName = '' } = {} } = {},
    data: { firstName = '', lastName = '', middleName = '' },
    pendingTasks = [],
    events = [],
    unseenTotal,
    activeConversationUnseen,
  } = props;

  const [notification, setNotification] = useState(0);
  const [openUpcomingEventModal, setOpenUpcomingEventModal] = useState(false);
  let candidateFullName = `${firstName} ${middleName} ${lastName}`;
  if (!middleName) candidateFullName = `${firstName} ${lastName}`;

  // if link contains "ticket", it means that candidate is in candidate progress page
  const [isCandidateMode, setCandidateMode] = useState(false);

  const authorized = getAuthorityFromRouter(routes, location.pathname || '/') || {
    authority: undefined,
  };
  const disablePage = getFirstChangePassword();

  const fetchNotificationList = async () => {
    if (candidate) {
      await dispatch({
        type: 'conversation/getConversationUnSeenEffect',
        payload: {
          userId: candidate?._id,
        },
      });
    }
  };

  useEffect(() => {
    fetchNotificationList();
  }, [JSON.stringify(candidate)]);

  useEffect(() => {
    setNotification(Number(unseenTotal));
  }, [JSON.stringify(activeConversationUnseen)]);

  const saveNewMessage = (message) => {
    dispatch({
      type: 'conversation/saveNewMessage',
      payload: message,
    });
  };

  const getListLastMessage = () => {
    dispatch({
      type: 'conversation/getListLastMessageEffect',
      payload: {
        userId: candidate._id,
      },
    });
  };

  useEffect(() => {
    if (!candidate) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  const initialSocket = () => {
    socket.emit(ChatEvent.ADD_USER, candidate?._id);
    socket.on(ChatEvent.GET_MESSAGE, (message) => {
      saveNewMessage(message);
      fetchNotificationList();
      getListLastMessage();
    });
  };

  const getViewingTask = () => {
    const currentLink = window.location.href;
    return pendingTasks.find((task) => currentLink.includes(task.id));
  } 
  const viewingTask = getViewingTask()
  
  useEffect(() => {
    if (candidate) {
      dispatch({
        type: 'optionalQuestion/getListPage',
        payload: {
          candidate: candidate._id,
        },
      });

      initialSocket();
    }
  }, [JSON.stringify(candidate)]);

  useEffect(() => {
    setCandidateMode(window.location.href.includes('ticket'));
    return () => {};
  }, [window.location.href]);

  useEffect(() => {
    if (
      viewingTask &&
      [CANDIDATE_TASK_STATUS.DONE, CANDIDATE_TASK_STATUS.UPCOMING].includes(viewingTask?.status)
    ) {
      history.replace('/candidate-portal');
    }
    return () => {};
  }, [pendingTasks, window.location.href]);

  const handleCancel = () => {
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        listPage: [],
      },
    });
    dispatch({
      type: 'login/logoutCandidate',
    });
  };

  const companyLogo = () => {
    const currentCompany =
      companiesOfUser.find((company) => company?._id === getCurrentCompany()) || {};
    return currentCompany.logoUrl || avtDefault;
  };

  const companyName = () => {
    const currentCompany =
      companiesOfUser.find((company) => company?._id === getCurrentCompany()) || {};
    return currentCompany.name || '';
  };

  const getBreadcrumbName = () => {
    switch (viewingTask?.id) {
      case CANDIDATE_TASK_LINK.DOCUMENTS_CHECKLIST:
        return 'Upload Documents'
      default:
        return 'Employee Onboarding'
    }
  }
  
  const avatarMenu = (
    <Menu
      className={s.dropdownMenu}
      style={{ padding: '8px 0 0', borderRadius: '12px', marginTop: '11px' }}
    >
      <Menu.Item style={{ color: '#707177', paddingBlock: '5px', pointerEvents: 'none' }}>
        {candidateFullName}
      </Menu.Item>
      <Menu.Item
        style={{
          color: '#707177',
          fontWeight: 500,
          paddingTop: '5px',
          paddingBottom: '10px',
          pointerEvents: 'none',
        }}
      >
        Candidate ID: {ticketId}
      </Menu.Item>
      <Menu.Item
        onClick={handleCancel}
        style={{
          borderTop: '1px solid #E2E4E8',
          paddingBlock: '10px',
          borderRadius: '0 0 12px 12px',
        }}
      >
        <span style={{ color: '#FD4546' }} className={s.logoutText}>
          Logout
        </span>
      </Menu.Item>
    </Menu>
  );

  const addZeroToNumber = (number) => {
    if (number < 10 && number >= 0) return `0${number}`.slice(-2);
    return number;
  };

  return (
    <div className={s.candidate}>
      {/* <Header className={`${s.header} ${s.one}`}> */}
      <Header className={`${s.header} `}>
        <div
          className={s.headerLeft}
          onClick={
            disablePage
              ? null
              : () => {
                  history.push(`/candidate-portal/dashboard`);
                }
          }
        >
          <div className={s.imgContainer}>
            <img src={companyLogo()} alt="logo" />
          </div>
          <span className={s.companyName}>{companyName()}</span>
          {/* {isCandidateMode && (
            <>
              <RightOutlined className={s.icon} />
              {titleName && <span className={s.description}>Candidature for {titleName}</span>}
            </>
          )} */}
        </div>

        <div className={s.headerRight}>
          {/* {isCandidateMode && (
            <div className={s.headerText}>
              <span>Candidate ID: {ticketId}</span>
            </div>
          )} */}

          <div
            className={s.headerIcon}
            onClick={disablePage ? null : () => setOpenUpcomingEventModal(true)}
          >
            <img src={CalendarIcon} alt="calendar" />
          </div>
          <div
            className={s.headerIcon}
            onClick={
              disablePage
                ? null
                : () => {
                    history.push(`/candidate-portal/messages/`);
                  }
            }
          >
            <img src={MessageIcon} alt="message" />
            {notification > 0 && <div className={s.badgeNumber}>{notification}</div>}
          </div>

          <Dropdown
            style={{
              borderRadius: '15px',
              background: 'red',
            }}
            overlayClassName={s.dropdownMenu}
            overlay={avatarMenu}
            placement="bottomRight"
          >
            <div className={`${s.headerIcon} ${s.avatarIcon}`}>
              {/* <img src={LogoutIcon} alt="logout" /> */}
              <span>
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </span>
            </div>
          </Dropdown>
        </div>
      </Header>
      <CommonModal
        title={`Upcoming events (${addZeroToNumber(events.length)})`}
        content={events}
        visible={openUpcomingEventModal}
        onClose={() => setOpenUpcomingEventModal(false)}
        type="your-activity"
        tabKey="1"
      />
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {loadingFetchCurrent ? (
          <div style={{ margin: '32px 89px' }}>
            <Skeleton />
          </div>
        ) : (
          <>
            {isCandidateMode && (
              <div className={s.customBreadcrumb}>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <a href="/candidate-portal">Home</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <a href="">{getBreadcrumbName()}</a>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            )}
            <Content className={s.main}>{children}</Content>
          </>
        )}
      </Authorized>
      <Footer />
    </div>
  );
});

// export default CandidatePortalLayout;
export default connect(
  ({
    optionalQuestion: { listPage },
    candidatePortal: {
      data,
      localStep,
      ticketId,
      checkCandidateMandatory,
      checkMandatory,
      processStatus = '',
      pendingTasks = [],
      upcomingEvents: events = [],
      nextSteps: steps = [],
    } = {},
    conversation,
    conversation: { activeConversationUnseen = [], unseenTotal = 0 },
    user: { companiesOfUser = [], currentUser: { candidate = '' } = {} } = {},
    loading,
  }) => ({
    activeConversationUnseen,
    unseenTotal,
    conversation,
    listPage,
    data,
    candidate,
    localStep,
    checkCandidateMandatory,
    checkMandatory,
    ticketId,
    processStatus,
    companiesOfUser,
    pendingTasks,
    events,
    steps,
    loadingFetchCurrent: loading.effects['user/fetchCurrent'],
  }),
)(CandidatePortalLayout);
