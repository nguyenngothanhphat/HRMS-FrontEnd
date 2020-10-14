import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

const { ID, NAME, POSITION, LOCATION, DATE_RECEIVED, ACTION } = COLUMN_NAME;
const { RECEIVED_PROVISIONAL_OFFERS } = TABLE_TYPE;

class IneligibleCandidates extends PureComponent {
  render() {
    const { list = [] } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, DATE_RECEIVED, ACTION]}
        type={RECEIVED_PROVISIONAL_OFFERS}
        inTab
      />
    );
  }
}

export default IneligibleCandidates;
