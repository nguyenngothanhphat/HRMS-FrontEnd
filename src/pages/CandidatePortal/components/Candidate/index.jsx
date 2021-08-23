import { getCurrentTenant } from '@/utils/authority';
import { Button, Col, Row, Skeleton, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { candidateLink } from '@/utils/candidatePortal';
import AdditionalQuestion from './components/AdditionalQuestion';
import BasicInformation from './components/BasicInfomation';
import Benefits from './components/Benefits';
import EligibilityDocs from './components/EligibilityDocs';
import JobDetails from './components/JobDetails';
import OfferDetails from './components/OfferDetails';
import OfferLetter from './components/OfferLetter';
import SalaryStructure from './components/SalaryStructure';

// list:
// 1: BasicInformation
// 2: JobDetails
// 3: EligibilityDocs
// 4: SalaryStructure
// 5: OfferDetails
// 6: OfferLetter

import styles from './index.less';

const Candidate = (props) => {
  const {
    dispatch,
    loadingFetchCandidate,
    listPage,
    localStep,
    candidate,
    data: { title = {} } = {},
    match,
  } = props;

  const [screen, setScreen] = useState(localStep);

  const getScreenToShow = () => {
    const { params: { action = '' } = {} } = match;
    switch (action) {
      case candidateLink.reviewProfile:
        if (localStep === 1) setScreen(1);
        else setScreen(localStep);
        break;
      case candidateLink.uploadDocuments:
        setScreen(3);
        break;
      case candidateLink.salaryNegotiation:
        setScreen(4);
        break;
      case candidateLink.acceptOffer:
        setScreen(6);
        break;

      default:
        setScreen(1);
        break;
    }
  };

  useEffect(() => {
    // setScreen(localStep);
    getScreenToShow();

    // return localStep to 1 when unmount
    return () => {
      if (localStep !== 1) {
        dispatch({
          type: 'candidatePortal/save',
          payload: {
            localStep: 1,
          },
        });
      }
    };
  }, [localStep]);

  useEffect(() => {
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidatePortal/fetchCandidateById',
      payload: {
        candidate: candidate._id,
        tenantId: getCurrentTenant(),
        rookieID: candidate.ticketID,
      },
    });
  }, []);

  const _renderScreen = (id) => {
    switch (id) {
      case 1:
        return <BasicInformation />;
      case 2:
        return <JobDetails />;
      case 3:
        return <EligibilityDocs />;
      case 4:
        return <SalaryStructure />;
      case 5:
        return <OfferDetails />;
      case 6:
        return <OfferLetter />;
      default:
        return <div />;
    }
  };

  const getSteps = () => {
    const { params: { action = '' } = {} } = match;
    const defaultSet = [
      { id: 1, title: 'Basic Information', disabled: false },
      { id: 2, title: 'Job Details', disabled: false },
    ];
    switch (action) {
      case candidateLink.reviewProfile:
        return [
          { id: 1, title: 'Basic Information', disabled: false },
          { id: 2, title: 'Job Details', disabled: false },
        ];
      case candidateLink.uploadDocuments:
        return [{ id: 3, title: 'Eligibility documents', disabled: false }];
      case candidateLink.salaryNegotiation:
        return [{ id: 4, title: 'Salary Negotiation', disabled: false }];
      case candidateLink.acceptOffer:
        return [{ id: 6, title: 'Offer Letter', disabled: false }];

      default:
        return defaultSet;
    }
  };

  const handleStepClick = (id) => {
    if (!dispatch) {
      return;
    }

    dispatch({
      type: 'candidatePortal/save',
      payload: {
        localStep: id,
      },
    });
  };

  const steps = getSteps();

  const onBack = () => {
    history.push('/candidate-portal/dashboard');
  };

  return (
    <div className={styles.Candidate}>
      <div className={styles.headerBar}>
        <span className={styles.title}>Candidature for {title?.name}</span>
        <div className={styles.actionBtn}>
          <Button className={styles.finishLaterBtn} onClick={onBack}>
            Finish Later
          </Button>
          {/* <Button className={styles.cancelBtn} onClick={onBack}>
            Cancel
          </Button> */}
        </div>
      </div>
      <div className={styles.content}>
        <Row gutter={24}>
          <Col xs={24} lg={7} xl={6}>
            <div className={styles.stepContainer}>
              <Steps current={screen - 1} direction="vertical">
                {steps.map((item) => {
                  const { title: title1, id, disabled } = item;
                  return (
                    <Steps.Step
                      disabled={disabled}
                      key={title}
                      title={title1}
                      onClick={disabled ? () => {} : () => handleStepClick(id)}
                    />
                  );
                })}
              </Steps>
            </div>
          </Col>
          <Col xs={24} lg={17} xl={18} style={{ paddingBlock: '24px' }}>
            {loadingFetchCandidate ? <Skeleton /> : _renderScreen(screen)}
          </Col>
        </Row>
      </div>
    </div>
  );
};

// export default Candidate;
export default connect(
  ({
    optionalQuestion: { listPage = [] },
    candidatePortal: { localStep, data, tempData } = {},
    user: { currentUser: { candidate = '' } = {} } = {},
    loading,
  }) => ({
    listPage,
    localStep,
    data,
    tempData,
    candidate,
    loadingFetchCandidate: loading.effects['candidatePortal/fetchCandidateById'],
  }),
)(Candidate);
