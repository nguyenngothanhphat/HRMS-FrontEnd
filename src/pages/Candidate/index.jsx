import React, { useState } from 'react';

import BasicInfomation from './components/BasicInfomation';
import OfferDetails from './components/OfferDetails';
import JobDetails from './components/JobDetails';

const _renderScreen = (screenNumber) => {
  switch (screenNumber) {
    case 1:
      return <BasicInfomation />;
    case 2:
      return <JobDetails />;
    case 4:
      return <OfferDetails />;
    default:
      return <BasicInfomation />;
  }
};

const Candidate = (props) => {
  const [screen, setScreen] = useState(2);

  return <div>{_renderScreen(screen)}</div>;
};

export default Candidate;
