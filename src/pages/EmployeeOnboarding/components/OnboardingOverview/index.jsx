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

const MENU_DATA_1 = [
  {
    id: 1,
    name: 'Pending Eligibility Checks',
    quantity: 14,
    key: 'pendingEligibilityChecks',
    component: <PendingEligibilityChecks />,
  },
  {
    id: 2,
    name: 'Eligible Candidates',
    quantity: 9,
    key: 'eligibleCandidates',
    component: <EligibleCandidates />,
  },
  {
    id: 3,
    name: 'Ineligible candidates',
    quantity: 10,
    key: 'ineligibleCandidates',
    component: <IneligibleCandidates />,
  },
];

const MENU_DATA_2 = [
  {
    id: 4,
    name: 'Provisional offers',
    quantity: 10,
    key: 'provisionalOffers',
    component: <ProvisionalOffers />,
  },
  {
    id: 5,
    name: 'Discarded Provisional offers',
    quantity: 10,
    key: 'discardedProvisionalOffers',
    component: <DiscardedProvisionalOffers />,
  },
];

const MENU_DATA_3 = [
  {
    id: 6,
    name: 'Awaiting approvals from HR',
    quantity: 9,
    key: 'awaitingApprovals',
    component: <AwaitingApprovals />,
  },
  {
    id: 7,
    name: 'Final offers',
    quantity: 10,
    key: 'finalOffers',
    component: <FinalOffers />,
  },
  {
    id: 8,
    name: 'Final Offer Drafts',
    quantity: 9,
    key: 'finalOfferDrafts',
    component: <FinalOfferDrafts />,
  },
  {
    id: 9,
    name: 'Discarded Final Offers',
    quantity: 12,
    key: 'discardedFinalOffers',
    component: <DiscardedFinalOffers />,
  },
];

const PHASE_DATA = [
  {
    id: 1,
    title: 'phase 1',
    menuItem: MENU_DATA_1,
  },
  {
    id: 2,
    title: 'phase 2',
    menuItem: MENU_DATA_2,
  },
  {
    id: 3,
    title: 'phase 3',
    menuItem: MENU_DATA_3,
  },
];

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
