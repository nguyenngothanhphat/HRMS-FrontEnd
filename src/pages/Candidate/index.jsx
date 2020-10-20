import React, { useState, useEffect } from 'react';
import { connect } from 'umi';

import BasicInfomation from './components/BasicInfomation';
import EligibilityDocs from './components/EligibilityDocs';
import OfferDetails from './components/OfferDetails';
import JobDetails from './components/JobDetails';
import Benefits from './components/Benefits';
import SalaryStructure from './components/SalaryStructure';

const _renderScreen = (screenNumber) => {
  switch (screenNumber) {
    case 1:
      return <BasicInfomation />;
    case 2:
      return <JobDetails />;
    case 3:
      return <EligibilityDocs />;
    case 4:
      return <OfferDetails />;
    case 5:
      return <Benefits />;
    case 6:
      return <SalaryStructure />;
    default:
      return <BasicInfomation />;
  }
};

const Candidate = (props) => {
  const { dispatch, currentStep, data } = props;
  const [screen, setScreen] = useState(currentStep);
  useEffect(() => {
    setScreen(currentStep);
    dispatch({
      type: 'candidateProfile/fetchCandidateInfo',
    }).then(({ statusCode, data: { _id } }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'candidateProfile/fetchCandidateById',
          payload: {
            candidate: _id,
          },
        });
      }
    });
  }, [currentStep]);

  return <div>{_renderScreen(screen)}</div>;
};

// export default Candidate;
export default connect(({ candidateProfile: { currentStep, data, tempData } = {} }) => ({
  currentStep,
  data,
  tempData,
}))(Candidate);
