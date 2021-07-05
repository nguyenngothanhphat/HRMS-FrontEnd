import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable/index';

// const list = rookieList.filter((rookie) => rookie.isNew != true);
const { ID, NAME, POSITION, LOCATION, DATE_JOIN, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } =
  COLUMN_NAME;
const { APPROVED_OFFERS } = TABLE_TYPE;

class ApprovedFinalOffers extends PureComponent {
  render() {
    const { list = [] } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, DATE_JOIN, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION]}
        type={APPROVED_OFFERS}
        inTab
        hasCheckbox
      />
    );
  }
}

export default ApprovedFinalOffers;
