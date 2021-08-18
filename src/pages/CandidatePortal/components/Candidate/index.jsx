import { getCurrentTenant } from '@/utils/authority';
import { Button, Col, Row, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import AdditionalQuestion from './components/AdditionalQuestion';
import BasicInformation from './components/BasicInfomation';
import Benefits from './components/Benefits';
import EligibilityDocs from './components/EligibilityDocs';
import JobDetails from './components/JobDetails';
import OfferDetails from './components/OfferDetails';
import PreviewOffer from './components/PreviewOffer';
import SalaryStructure from './components/SalaryStructure';
import styles from './index.less';

const Candidate = (props) => {
  const { dispatch, listPage, localStep, candidate, data: { title = {} } = {} } = props;

  const [screen, setScreen] = useState(localStep);
  useEffect(() => {
    setScreen(localStep);
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
    }).then(({ data, statusCode }) => {
      if (statusCode === 200) {
        const { _id } = data;
        dispatch({
          type: 'candidatePortal/fetchDocumentByCandidate',
          payload: {
            candidate: _id,
            tenantId: getCurrentTenant(),
          },
        });
        dispatch({
          type: 'candidatePortal/fetchWorkHistory',
          payload: {
            candidate: _id,
            tenantId: getCurrentTenant(),
          },
        });
      }
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
        return <Benefits />;
      case 7:
        return <PreviewOffer />;
      case 8:
        return <AdditionalQuestion />;
      default:
        return <div />;
    }
  };

  const getSteps = () => {
    return [
      { id: 1, title: 'Basic Information', disabled: false },
      { id: 2, title: 'Job Details', disabled: false },
      { id: 3, title: 'Eligibility documents', disabled: false },
    ];
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
          <Button className={styles.cancelBtn} onClick={onBack}>
            Cancel
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <Row gutter={24}>
          <Col xs={24} lg={7} xl={6}>
            <div className={styles.stepContainer}>
              <Steps current={screen - 1} direction="vertical">
                {steps.map((item) => {
                  const { title: title1, id } = item;
                  return (
                    <Steps.Step key={title} title={title1} onClick={() => handleStepClick(id)} />
                  );
                })}
              </Steps>
            </div>
          </Col>
          <Col xs={24} lg={17} xl={18} style={{ paddingBlock: '24px' }}>
            {_renderScreen(screen)}
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
  }) => ({
    listPage,
    localStep,
    data,
    tempData,
    candidate,
  }),
)(Candidate);
