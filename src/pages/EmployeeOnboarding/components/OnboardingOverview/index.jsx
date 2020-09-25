import React, { PureComponent } from 'react';
import OnboardingLayout from '@/components/OnboardingLayout';

import AwaitingApprovalsFromHR from './components/AwaitingApprovalsFromHR';
import DiscardedProvisionalOffers from './components/DiscardedProvisionalOffers';
import EligibleCandidates from './components/EligibleCandidates';
import FinalOfferDrafts from './components/FinalOfferDrafts';
import FinalOffers from './components/FinalOffers';
import IneligibleCandidates from './components/IneligibleCandidates';
import PendingEligibilityChecks from './components/PendingEligibilityChecks';
import ProvisionalOffers from './components/ProvisionalOffers';

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
    component: <AwaitingApprovalsFromHR />,
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
    return (
      <div>
        <OnboardingLayout listMenu={PHASE_DATA} />
      </div>
    );
  }
}

export default OnboardingOverview;
