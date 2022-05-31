import { Button, Col, Row, Skeleton, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import { CANDIDATE_TASK_LINK } from '@/utils/candidatePortal';
// import AdditionalQuestion from './components/AdditionalQuestion';
import BasicInformation from './components/BasicInfomation';
// import Benefits from './components/Benefits';
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
// 7: References

import styles from './index.less';
import References from './components/References';
import { goToTop } from '@/utils/utils';

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
  const [loadingFinishLater, setLoadingFinishLater] = useState(false);

  const getScreenToShow = () => {
    const { params: { action = '' } = {} } = match;
    switch (action) {
      case CANDIDATE_TASK_LINK.REVIEW_PROFILE:
        if (localStep === 1) setScreen(1);
        else setScreen(localStep);
        break;
      case CANDIDATE_TASK_LINK.UPLOAD_DOCUMENTS:
        setScreen(3);
        break;
      case CANDIDATE_TASK_LINK.SALARY_NEGOTIATION:
        setScreen(4);
        break;
      case CANDIDATE_TASK_LINK.ACCEPT_OFFER:
        setScreen(6);
        break;
      case CANDIDATE_TASK_LINK.REFERENCES:
        setScreen(7);
        break;
      default:
        setScreen(1);
        break;
    }
  };

  const wait = (delay, ...args) => {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve) => {
      setTimeout(resolve, delay, ...args);
    });
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
    goToTop();
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
      case 7:
        return <References />;
      default:
        return <div />;
    }
  };

  const getSteps = () => {
    const { params: { action = '' } = {} } = match;
    const defaultSet = [
      { id: 1, title: 'Basic Information', disabled: true },
      { id: 2, title: 'Job Details', disabled: true },
    ];
    switch (action) {
      case CANDIDATE_TASK_LINK.REVIEW_PROFILE:
        return [
          { id: 1, title: 'Basic Information', disabled: true },
          { id: 2, title: 'Job Details', disabled: true },
        ];
      case CANDIDATE_TASK_LINK.UPLOAD_DOCUMENTS:
        return [{ id: 3, title: 'Upload Documents', disabled: true }];
      case CANDIDATE_TASK_LINK.SALARY_NEGOTIATION:
        return [{ id: 4, title: 'Salary Proposal', disabled: true }];
      case CANDIDATE_TASK_LINK.ACCEPT_OFFER:
        return [{ id: 6, title: 'Offer Letter', disabled: true }];
      case CANDIDATE_TASK_LINK.REFERENCES:
        return [{ id: 7, title: 'References', disabled: true }];
      default:
        return defaultSet;
    }
  };

  const handleStepClick = (id) => {
    if (!dispatch) {
      return;
    }
    goToTop();

    dispatch({
      type: 'candidatePortal/save',
      payload: {
        localStep: id,
      },
    });
  };

  const steps = getSteps();

  const onBack = async () => {
    setLoadingFinishLater(true);
    await wait(1000).then(() => setLoadingFinishLater(false));
    history.push('/candidate-portal/dashboard');
  };

  return (
    <div className={styles.Candidate}>
      <div className={styles.headerBar}>
        <span className={styles.title}>Candidature for {title?.name}</span>
        {!window.location.href.includes(CANDIDATE_TASK_LINK.ACCEPT_OFFER) && (
          <div className={styles.actionBtn}>
            <Button loading={loadingFinishLater} className={styles.finishLaterBtn} onClick={onBack}>
              Finish Later
            </Button>
            {/* <Button className={styles.cancelBtn} onClick={onBack}>
            Cancel
          </Button> */}
          </div>
        )}
      </div>

      <Row gutter={[24, 24]} className={styles.content}>
        <Col xs={24} lg={7} xl={6}>
          <div className={styles.stepContainer} style={{ marginBottom: 0 }}>
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
        <Col xs={24} lg={17} xl={18} className={styles.contentBody}>
          {loadingFetchCandidate ? <Skeleton /> : _renderScreen(screen)}
        </Col>
      </Row>
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
