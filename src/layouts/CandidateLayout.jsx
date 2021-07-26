import React, { useState, useEffect } from 'react';
import { connect, Link } from 'umi';

import { Row, Col, Layout, Button, Steps, Result } from 'antd';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';

import { RightOutlined } from '@ant-design/icons';
import { getCurrentCompany } from '@/utils/authority';
import avtDefault from '@/assets/avtDefault.jpg';
// import BottomBar from '../components/BottomBar';
import s from './CandidateLayout.less';

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

const getLineWidth = (value) => {
  switch (value) {
    case 1:
      return s.one;
    case 2:
      return s.two;
    case 3:
      return s.three;
    case 4:
      return s.four;
    case 5:
      return s.five;
    case 6:
      return s.six;

    default:
      return '';
  }
};

const CandidateLayout = (props) => {
  const {
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

  const steps = [
    {
      id: 1,
      title: 'Basic Infomation',
      content: 'First-content',
      disabled: !filledBasicInformation,
    },
    {
      id: 2,
      title: 'Job Details',
      content: 'Second-content',
      disabled: !filledJobDetail,
    },
    {
      id: 3,
      title: 'Salary Structure',
      content: 'Third-content',
      disabled: !filledSalaryStructure,
    },
    {
      id: 4,
      title: 'Document Verification',
      content: 'Fourth-content',
      disabled: !filledDocumentVerification,
    },
    {
      id: 5,
      title: 'Offer Details',
      content: 'Fifth-content',
      // disabled: !filledBasicInformation,
    },
    {
      id: 6,
      title: 'Benefits',
      content: 'Sixth-content',
      // disabled: !filledBasicInformation,
    },
    {
      id: 7,
      title: 'Additional Questions',
      content: 'Last-content',
      // disabled: !filledBasicInformation,
    },
  ];

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
      lcStep = 5;
    }
    if (
      [
        'ACCEPT-PROVISIONAL-OFFER',
        'PENDING-BACKGROUND-CHECK',
        'PENDING-APPROVAL-FINAL-OFFER',
      ].includes(processStatus)
    ) {
      lcStep = 4;
    }
    if (['RENEGOTIATE-PROVISONAL-OFFER'].includes(processStatus)) {
      lcStep = 3;
    }
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: lcStep,
      },
    });
    setCurrent(lcStep);
  }, [processStatus]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'candidateProfile/clearAll',
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
      type: 'login/logout',
    });
  };

  const renderPreviewOffer = () => {
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: 8,
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
        type: 'candidateProfile/save',
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
      return steps.slice(0, 4);
    }
    return steps;
  };

  const isPhase1 = (stepArr) => {
    return stepArr.length === 4;
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
      <Header className={`${s.header} ${getLineWidth(current - 1)}`}>
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
                      className={localStep === 8 ? `${s.btn} ${s.active}` : `${s.btn}`}
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
};

// export default CandidateLayout;
export default connect(
  ({
    candidateProfile: {
      localStep,
      title: { name: titleName = '' } = {},
      ticketId,
      checkCandidateMandatory,
      checkMandatory,
      processStatus = '',
    } = {},
    user: { companiesOfUser = [] } = {},
  }) => ({
    localStep,
    checkCandidateMandatory,
    checkMandatory,
    ticketId,
    processStatus,
    titleName,
    companiesOfUser,
  }),
)(CandidateLayout);
