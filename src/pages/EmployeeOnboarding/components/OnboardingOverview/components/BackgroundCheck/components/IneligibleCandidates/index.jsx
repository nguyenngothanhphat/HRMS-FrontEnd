import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

const { ID, NAME, POSITION, LOCATION, COMMENT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } = COLUMN_NAME;
const { INELIGIBLE_CANDIDATES } = TABLE_TYPE;

class IneligibleCandidates extends PureComponent {
  render() {
    const { list = [], pageSelected, size, getPageAndSize = () => {}, total } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION]}
        type={INELIGIBLE_CANDIDATES}
        inTab
        pageSelected={pageSelected}
        size={size}
        total={total}
        getPageAndSize={getPageAndSize}
      />
    );
  }
}

export default IneligibleCandidates;
