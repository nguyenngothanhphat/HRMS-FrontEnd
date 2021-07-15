import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

const { ID, NAME, POSITION, LOCATION, RESUBMIT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } = COLUMN_NAME;
const { ELIGIBLE_CANDIDATES } = TABLE_TYPE;

class EligibleCandidates extends PureComponent {
  render() {
    const { list = [], pageSelected, size, getPageAndSize = () => {}, total } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, RESUBMIT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION]}
        type={ELIGIBLE_CANDIDATES}
        inTab
        pageSelected={pageSelected}
        size={size}
        total={total}
        getPageAndSize={getPageAndSize}
      />
    );
  }
}

export default EligibleCandidates;
