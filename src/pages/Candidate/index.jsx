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
// import AdditionalQuestion from './components/AdditionalQuestion';
import PreviewOffer from './components/PreviewOffer';
import { Page } from '../FormTeamMember/utils';

const Candidate = (props) => {
  const {
    dispatch,
    listPage,
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
  const _renderScreen = (item) => {
    switch (item) {
      case Page.Basic_Information:
        return <BasicInfomation />;
      case Page.Job_Details:
        return <JobDetails />;
      case Page.Salary_Structure:
        return <SalaryStructure />;
      case Page.Eligibility_documents:
        return <EligibilityDocs />;
      case Page.Offer_Details:
        return <OfferDetails />;
      case Page.Benefits:
        return <Benefits />;
      case undefined:
        return <PreviewOffer />;
      default:
        return null;
    }
  };
  console.log('reRender', listPage);
  // if (loadingFetchDocumentsByCandidate || loadingFetchWorkHistory) return <Skeleton />;
  return <div>{_renderScreen(listPage[screen - 1])}</div>;
};

// export default Candidate;
export default connect(
  ({
    optionalQuestion: { listPage = [] },
    candidateProfile: { localStep, data, tempData } = {},
    user: { currentUser: { candidate = '' } = {} } = {},
  }) => ({
    listPage,
    localStep,
    data,
    tempData,
    candidate,
  }),
)(Candidate);
