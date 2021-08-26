import React, { useState, useEffect } from 'react';
import { connect, Link } from 'umi';

import { Row, Col, Layout, Button, Steps, Result } from 'antd';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';

import { RightOutlined } from '@ant-design/icons';
import { getCurrentCompany } from '@/utils/authority';
import avtDefault from '@/assets/avtDefault.jpg';
// import BottomBar from '../components/BottomBar';
import { indexOf } from 'lodash';
import s from './CandidateLayout.less';
import { Page } from '../pages/FormTeamMember/utils';

const { Header, Content } = Layout;
const { Step } = Steps;

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

// const getLineWidth = (value) => {
//   switch (value) {
//     case 1:
//       return s.one;
//     case 2:
//       return s.two;
//     case 3:
//       return s.three;
//     case 4:
//       return s.four;
//     case 5:
//       return s.five;
//     case 6:
//       return s.six;

//     default:
//       return '';
//   }
// };

const CandidateLayout = React.memo((props) => {
  const {
    listPage,
    candidate,
    children,
    localStep,
    location = {
      pathname: '/',
    },
    route: { routes } = {},
    ticketId,
    titleName = '',
    dispatch,
    processStatus = '',
    companiesOfUser = [],
    checkMandatory: {
      filledBasicInformation = false,
      filledJobDetail = false,
      filledSalaryStructure = false,
      filledDocumentVerification = false,
    } = {},
  } = props;

  const [current, setCurrent] = useState(1);
  useEffect(() => {
    if (candidate._id !== '') {
      dispatch({
        type: 'optionalQuestion/getListPage',
        payload: {
          candidate: candidate._id,
        },
      });
    }
  }, [candidate]);
  const [steps, setSteps] = useState([]);
  useEffect(() => {
    const tempStep = listPage.map((namePage, index) => {
      switch (namePage) {
        case Page.Basic_Information:
          return { id: index + 1, title: namePage, disabled: !filledBasicInformation };
        case Page.Job_Details:
          return { id: index + 1, title: namePage, disabled: !filledJobDetail };
        case Page.Salary_Structure:
          return { id: index + 1, title: namePage, disabled: !filledSalaryStructure };
        case Page.Eligibility_documents:
          return { id: index + 1, title: namePage, disabled: !filledDocumentVerification };
        default:
          return { id: index + 1, title: namePage };
      }
    });
    setSteps(tempStep);
  }, [listPage]);

  useEffect(() => {
    setCurrent(localStep);
  }, [localStep, processStatus]);

  useEffect(() => {
    let lcStep = 1;
    if (
      [
        'APPROVED-FINAL-OFFER',
        'SENT-FINAL-OFFERS',
        'ACCEPT-FINAL-OFFER',
        'RENEGOTIATE-FINAL-OFFERS',
        'DISCARDED-PROVISONAL-OFFER',
        'REJECT-FINAL-OFFER-HR',
        'REJECT-FINAL-OFFER-CANDIDATE',
      ].includes(processStatus)
    ) {
      lcStep = indexOf(listPage, Page.Offer_Details);
    }
    if (
      [
        'ACCEPT-PROVISIONAL-OFFER',
        'PENDING-BACKGROUND-CHECK',
        'PENDING-APPROVAL-FINAL-OFFER',
      ].includes(processStatus)
    ) {
      lcStep = indexOf(listPage, Page.Eligibility_documents);
    }
    if (['RENEGOTIATE-PROVISONAL-OFFER'].includes(processStatus)) {
      lcStep = indexOf(listPage, Page.Salary_Structure);
    }
    dispatch({
      type: 'candidatePortal/save',
      payload: {
        localStep: lcStep,
      },
    });
    setCurrent(lcStep);
  }, [processStatus]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'candidatePortal/clearAll',
      });
    };
  }, []);

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

  const renderPreviewOffer = () => {
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidatePortal/save',
      payload: {
        localStep: listPage.length + 1,
      },
    });
  };

  const handleStepClick = (id, isDisabled) => {
    if (!dispatch) {
      return;
    }

    // if (
    //   processStatus === 'SENT-PROVISIONAL-OFFER' ||
    //   processStatus === 'RENEGOTIATE-PROVISONAL-OFFER' ||
    //   processStatus === 'DISCARDED-PROVISONAL-OFFER' ||
    //   processStatus === 'PENDING-BACKGROUND-CHECK'
    // ) {
    //   if (id === 1 || id === 2 || id === 3 || id === 4) {
    //     valid = true;
    //   }
    // }

    if (!isDisabled) {
      dispatch({
        type: 'candidatePortal/save',
        payload: {
          localStep: id,
        },
      });
    }
  };

  const getSteps = () => {
    if (
      processStatus === 'SENT-PROVISIONAL-OFFER' ||
      processStatus === 'RENEGOTIATE-PROVISONAL-OFFER' ||
      processStatus === 'DISCARDED-PROVISONAL-OFFER' ||
      processStatus === 'PENDING-BACKGROUND-CHECK' ||
      processStatus === 'ACCEPT-PROVISIONAL-OFFER' ||
      processStatus === 'PENDING-APPROVAL-FINAL-OFFER'
    ) {
      return steps.slice(0, indexOf(listPage, Page.Offer_Details));
    }
    return steps;
  };

  const isPhase1 = (stepArr) => {
    return stepArr.length === indexOf(listPage, Page.Offer_Details);
  };

  const newSteps = getSteps();

  const companyLogo = () => {
    const currentCompany =
      companiesOfUser.find((company) => company?._id === getCurrentCompany()) || {};
    return currentCompany.logoUrl || avtDefault;
  };

  return (
    <div className={s.candidate}>
      {/* <Header className={`${s.header} ${s.one}`}> */}
      <Header
        className={`${s.header} `}
        style={{ width: `calc(100% / ${listPage.length})*${current - 1}` }}
      >
        <div className={s.headerLeft}>
          <div className={s.imgContainer}>
            <img src={companyLogo()} alt="logo" />
          </div>

          <RightOutlined className={s.icon} />

          {titleName && <span className={s.description}>Candidature for {titleName}</span>}
        </div>

        <div className={s.headerRight}>
          <span className={s.id}>Candidate ID: {ticketId}</span>

          <Button type="link" block onClick={handleCancel}>
            Logout
          </Button>
        </div>
      </Header>
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        <Content className={s.main}>
          <Row gutter={24}>
            <Col md={5}>
              {processStatus !== '' && (
                <div className={s.stepContainer}>
                  <Steps
                    current={current - 1}
                    direction="vertical"
                    className={isPhase1(newSteps) ? s.phase1Step : ''}
                  >
                    {newSteps.map((item) => {
                      const { title, id } = item;
                      return (
                        <Step
                          disabled={item.disabled}
                          key={title}
                          title={title}
                          onClick={() => handleStepClick(id, item.disabled)}
                        />
                      );
                    })}
                  </Steps>

                  {!isPhase1(newSteps) && (
                    <button
                      type="submit"
                      className={
                        localStep === listPage.length + 1 ? `${s.btn} ${s.active}` : `${s.btn}`
                      }
                      onClick={renderPreviewOffer}
                    >
                      Preview offer letter
                    </button>
                  )}
                </div>
              )}
            </Col>
            <Col md={19}>{children}</Col>
          </Row>
        </Content>
      </Authorized>
    </div>
  );
});

// export default CandidateLayout;
export default connect(
  ({
    optionalQuestion: { listPage },
    candidatePortal: {
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
)(CandidateLayout);
