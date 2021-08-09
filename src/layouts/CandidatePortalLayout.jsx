import React from 'react';
import { connect, Link } from 'umi';

import { Layout, Button, Result } from 'antd';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
import { getCurrentCompany } from '@/utils/authority';
import avtDefault from '@/assets/avtDefault.jpg';
// import BottomBar from '../components/BottomBar';
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
  } = props;

  const authorized = getAuthorityFromRouter(routes, location.pathname || '/') || {
    authority: undefined,
  };

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

  return (
    <div className={s.candidate}>
      {/* <Header className={`${s.header} ${s.one}`}> */}
      <Header className={`${s.header} `}>
        <div className={s.headerLeft}>
          <div className={s.imgContainer}>
            <img src={companyLogo()} alt="logo" />
          </div>
        </div>

        <div className={s.headerRight}>
          <Button type="link" block onClick={handleCancel}>
            Logout
          </Button>
        </div>
      </Header>
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        <Content className={s.main}>{children}</Content>
      </Authorized>
    </div>
  );
});

// export default CandidatePortalLayout;
export default connect(
  ({
    optionalQuestion: { listPage },
    candidateProfile: {
      data,
      localStep,
      title: { name: titleName = '' } = {},
      ticketId,
      checkCandidateMandatory,
      checkMandatory,
      processStatus = '',
    } = {},
    user: { companiesOfUser = [], currentUser: { candidate = '' } = {} } = {},
  }) => ({
    listPage,
    data,
    candidate,
    localStep,
    checkCandidateMandatory,
    checkMandatory,
    ticketId,
    processStatus,
    titleName,
    companiesOfUser,
  }),
)(CandidatePortalLayout);
