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
  const { dispatch, localStep, candidate } = props;
  const [screen, setScreen] = useState(localStep);
  console.log(candidate);
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
        candidate,
      },
    });
  }, []);

  return <div>{_renderScreen(screen)}</div>;
};

// export default Candidate;
export default connect(
  ({ candidateProfile: { localStep, data, tempData } = {}, login: { candidate } }) => ({
    localStep,
    data,
    tempData,
    candidate,
  }),
)(Candidate);
