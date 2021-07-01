import React, { PureComponent } from 'react';
import { connect } from 'umi';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable/index';

// const list = rookieList;
const { ID, NAME, POSITION, LOCATION, COMMENT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } = COLUMN_NAME;
const { ELIGIBLE_CANDIDATES } = TABLE_TYPE;

class EligibleCandidates extends PureComponent {
  render() {
    const { eligibleCandidates } = this.props;
    return (
      <OnboardTable
        list={eligibleCandidates}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION]}
        type={ELIGIBLE_CANDIDATES}
      />
    );
  }
}

// export default EligibleCandidates;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { eligibleCandidates = [] } = onboardingOverview;
  return {
    eligibleCandidates,
  };
})(EligibleCandidates);
