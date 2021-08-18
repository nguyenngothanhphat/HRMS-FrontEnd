import React, { useEffect, useState } from 'react';
import { connect, Link, history } from 'umi';

import { Layout, Button, Result, Skeleton } from 'antd';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
import { getCurrentCompany } from '@/utils/authority';
import avtDefault from '@/assets/avtDefault.jpg';
import Footer from '@/components/Footer';
import LogoutIcon from '@/assets/candidatePortal/logout.svg';
import CalendarIcon from '@/assets/candidatePortal/leave-application.svg';
import MessageIcon from '@/assets/candidatePortal/message-circle.svg';
// import BottomBar from '../components/BottomBar';
import { RightOutlined } from '@ant-design/icons';
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
    data: { title: { name: titleName = '' } = {} } = {},
  } = props;

  // if link contains "ticket", it means that candidate is in candidate progress page
  const [isCandidateMode, setCandidateMode] = useState(false);

  const authorized = getAuthorityFromRouter(routes, location.pathname || '/') || {
    authority: undefined,
  };

  useEffect(() => {
    if (!candidate) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    if (candidate) {
      dispatch({
        type: 'optionalQuestion/getListPage',
        payload: {
          candidate: candidate._id,
        },
      });
    }
  }, [candidate]);

  useEffect(() => {
    setCandidateMode(window.location.href.includes('ticket'));
    return () => {};
  }, [window.location.href]);

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
      type: 'login/logout',
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

  return (
    <div className={s.candidate}>
      {/* <Header className={`${s.header} ${s.one}`}> */}
      <Header className={`${s.header} `}>
        <div
          className={s.headerLeft}
          onClick={() => {
            history.push(`/candidate-portal/dashboard`);
          }}
        >
          <div className={s.imgContainer}>
            <img src={companyLogo()} alt="logo" />
          </div>
          <span className={s.companyName}>{companyName()}</span>
          {isCandidateMode && (
            <>
              <RightOutlined className={s.icon} />
              {titleName && <span className={s.description}>Candidature for {titleName}</span>}
            </>
          )}
        </div>

        <div className={s.headerRight}>
          {isCandidateMode && (
            <div className={s.headerText}>
              <span>Candidate ID: {ticketId}</span>
            </div>
          )}

          <div className={s.headerIcon}>
            <img src={CalendarIcon} alt="calendar" />
          </div>
          <div
            className={s.headerIcon}
            onClick={() => {
              history.push(`/candidate-portal/messages/`);
            }}
          >
            <img src={MessageIcon} alt="message" />
            <div className={s.badgeNumber}>6</div>
          </div>
          <div className={s.headerIcon} onClick={handleCancel}>
            <img src={LogoutIcon} alt="logout" />
          </div>
        </div>
      </Header>
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {loadingFetchCurrent ? (
          <div style={{ margin: '32px 89px' }}>
            <Skeleton />
          </div>
        ) : (
          <Content className={s.main}>{children}</Content>
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
    } = {},
    user: { companiesOfUser = [], currentUser: { candidate = '' } = {} } = {},
    loading,
  }) => ({
    listPage,
    data,
    candidate,
    localStep,
    checkCandidateMandatory,
    checkMandatory,
    ticketId,
    processStatus,
    companiesOfUser,
    loadingFetchCurrent: loading.effects['user/fetchCurrent'],
  }),
)(CandidatePortalLayout);
