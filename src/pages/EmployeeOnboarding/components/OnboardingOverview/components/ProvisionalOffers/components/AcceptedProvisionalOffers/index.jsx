import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

const { ID, NAME, POSITION, LOCATION, ACTION } = COLUMN_NAME;
const { ACCEPTED__PROVISIONAL_OFFERS } = TABLE_TYPE;

class AcceptedProvisionalOffers extends PureComponent {
  render() {
    const { list = [] } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, ACTION]}
        type={ACCEPTED__PROVISIONAL_OFFERS}
        inTab
      />
    );
  }
}

export default AcceptedProvisionalOffers;
