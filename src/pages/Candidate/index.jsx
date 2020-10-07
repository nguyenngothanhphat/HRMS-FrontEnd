import React, { useState } from 'react';

import BasicInfomation from './components/BasicInfomation';
import OfferDetails from './components/OfferDetails';

const _renderScreen = (screenNumber) => {
  switch (screenNumber) {
    case 1:
      return <BasicInfomation />;
    case 4:
      return <OfferDetails />;
    default:
      return <BasicInfomation />;
  }
};

const Candidate = (props) => {
  const [screen, setScreen] = useState(1);

  return <div>{_renderScreen(screen)}</div>;
};

export default Candidate;
