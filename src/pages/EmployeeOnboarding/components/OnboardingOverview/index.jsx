import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { connect, Link } from 'umi';
import OnboardingLayout from '@/components/OnboardingLayout';

import AwaitingApprovals from './components/AwaitingApprovals';
import DiscardedProvisionalOffers from './components/DiscardedProvisionalOffers';
import EligibleCandidates from './components/EligibleCandidates';
import FinalOfferDrafts from './components/FinalOfferDrafts';
import FinalOffers from './components/FinalOffers';
import IneligibleCandidates from './components/IneligibleCandidates';
import PendingEligibilityChecks from './components/PendingEligibilityChecks';
import ProvisionalOffers from './components/ProvisionalOffers';
import DiscardedFinalOffers from './components/DiscardedFinalOffers';

import styles from './index.less';

class OnboardingOverview extends PureComponent {
  render() {
    const { menu = {} } = this.props;
    const { onboardingOverviewTab = {} } = menu;
    const { phaseList = [] } = onboardingOverviewTab;

    return (
      <div>
        <OnboardingLayout listMenu={phaseList} />
      </div>
    );
  }
}

// export default OnboardingOverview;
export default connect((state) => {
  const { onboard = {} } = state;
  const { menu = {} } = onboard;
  return {
    menu,
  };
})(OnboardingOverview);
