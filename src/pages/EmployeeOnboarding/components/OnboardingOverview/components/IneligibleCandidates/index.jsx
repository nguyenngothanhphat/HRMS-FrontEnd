import React, { PureComponent } from 'react';
import { connect } from 'umi';
import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable/index';

// const list = rookieList;
const { ID, NAME, POSITION, LOCATION, COMMENT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } = COLUMN_NAME;
const { INELIGIBLE_CANDIDATES } = TABLE_TYPE;

class IneligibleCandidates extends PureComponent {
  render() {
    const { ineligibleCandidates } = this.props;
    return (
      <OnboardTable
        list={ineligibleCandidates}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION]}
        type={INELIGIBLE_CANDIDATES}
      />
    );
  }
}

export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { ineligibleCandidates = [] } = onboardingOverview;
  return {
    ineligibleCandidates,
  };
})(IneligibleCandidates);
