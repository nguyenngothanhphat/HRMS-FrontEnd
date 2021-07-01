import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

const { ID, NAME, POSITION, LOCATION, DATE_JOIN, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } =
  COLUMN_NAME;
const { FINAL_OFFERS_DRAFTS } = TABLE_TYPE;

class FinalOfferDrafts extends PureComponent {
  render() {
    const { list = [] } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, DATE_JOIN, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION]}
        type={FINAL_OFFERS_DRAFTS}
        inTab
      />
    );
  }
}

export default FinalOfferDrafts;
