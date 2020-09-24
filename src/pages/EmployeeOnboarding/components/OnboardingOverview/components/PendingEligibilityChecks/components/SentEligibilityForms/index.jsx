import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

const { ID, NAME, POSITION, LOCATION, DATE_SENT, ACTION } = COLUMN_NAME;
const { SENT_ELIGIBILITY_FORMS } = TABLE_TYPE;

class SentEligibilityForms extends PureComponent {
  render() {
    const { list = [] } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, DATE_SENT, ACTION]}
        type={SENT_ELIGIBILITY_FORMS}
        inTab
      />
    );
  }
}

export default SentEligibilityForms;
