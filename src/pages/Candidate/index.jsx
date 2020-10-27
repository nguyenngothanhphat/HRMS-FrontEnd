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
      return <SalaryStructure />;
    case 4:
      return <EligibilityDocs />;
    case 5:
      return <OfferDetails />;
    case 6:
      return <Benefits />;
    default:
      return <BasicInfomation />;
  }
};

const Candidate = (props) => {
  const { dispatch, currentStep, candidate } = props;
  const [screen, setScreen] = useState(currentStep);
  console.log(candidate);
  useEffect(() => {
    setScreen(currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidateProfile/fetchCandidateById',
      payload: {
        candidate,
      },
    });
  }, []);

  return <div>{_renderScreen(screen)}</div>;
};

// export default Candidate;
export default connect(
  ({ candidateProfile: { currentStep, data, tempData } = {}, login: { candidate } }) => ({
    currentStep,
    data,
    tempData,
    candidate,
  }),
)(Candidate);
