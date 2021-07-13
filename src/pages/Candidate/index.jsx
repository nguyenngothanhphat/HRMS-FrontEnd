import React, { useState, useEffect } from 'react';
// import { Skeleton } from 'antd';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import BasicInfomation from './components/BasicInfomation';
import EligibilityDocs from './components/EligibilityDocs';
import OfferDetails from './components/OfferDetails';
import JobDetails from './components/JobDetails';
import Benefits from './components/Benefits';
import SalaryStructure from './components/SalaryStructure';
import AdditionalQuestion from './components/AdditionalQuestion';
import PreviewOffer from './components/PreviewOffer';

const _renderScreen = (screenNumber) => {
  switch (screenNumber) {
    case 1:
      return <BasicInfomation />;
    case 2:
      return <JobDetails />;
    case 3:
      return <SalaryStructure />;
    case 4:
      return <EligibilityDocs />;
    case 5:
      return <OfferDetails />;
    case 6:
      return <Benefits />;
    case 7:
      return <AdditionalQuestion />;
    case 8:
      return <PreviewOffer />;
    default:
      return null;
  }
};

const Candidate = (props) => {
  const {
    dispatch,
    localStep,
    candidate,
    // loadingFetchDocumentsByCandidate = false,
    // loadingFetchWorkHistory = false,
  } = props;
  const [screen, setScreen] = useState(localStep);
  useEffect(() => {
    setScreen(localStep);
  }, [localStep]);

  useEffect(() => {
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidateProfile/fetchCandidateById',
      payload: {
        candidate: candidate._id,
        tenantId: getCurrentTenant(),
        rookieID: candidate.ticketID,
      },
    }).then(({ data, statusCode }) => {
      if (statusCode === 200) {
        const {
          _id,
          //  documentChecklistSetting
        } = data;
        // const { employer } = documentChecklistSetting[3];
        dispatch({
          type: 'candidateProfile/fetchDocumentByCandidate',
          payload: {
            candidate: _id,
            tenantId: getCurrentTenant(),
          },
        });
        // if (employer !== undefined && employer.length > 0) {
        dispatch({
          type: 'candidateProfile/fetchWorkHistory',
          payload: {
            candidate: _id,
            tenantId: getCurrentTenant(),
          },
        });
        // }
      }
    });
  }, []);
  // if (loadingFetchDocumentsByCandidate || loadingFetchWorkHistory) return <Skeleton />;
  return <div>{_renderScreen(screen)}</div>;
};

// export default Candidate;
export default connect(
  ({
    candidateProfile: { localStep, data, tempData } = {},
    user: { currentUser: { candidate = '' } = {} } = {},
    loading,
  }) => ({
    localStep,
    data,
    tempData,
    candidate,
    loadingFetchWorkHistory: loading.effects['candidateProfile/fetchWorkHistory'],
    loadingFetchDocumentsByCandidate: loading.effects['candidateProfile/fetchDocumentByCandidate'],
  }),
)(Candidate);
