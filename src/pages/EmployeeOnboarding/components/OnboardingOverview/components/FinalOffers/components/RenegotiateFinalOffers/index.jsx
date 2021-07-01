import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

const { ID, NAME, POSITION, LOCATION, DATE_REQUEST, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } =
  COLUMN_NAME;
const { RENEGOTIATE_FINAL_OFFERS } = TABLE_TYPE;

class RenegotiateFinalOffer extends PureComponent {
  render() {
    const { list = [] } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[
          ID,
          NAME,
          POSITION,
          LOCATION,
          DATE_REQUEST,
          ASSIGN_TO,
          ASSIGNEE_MANAGER,
          ACTION,
        ]}
        type={RENEGOTIATE_FINAL_OFFERS}
        inTab
        // hasCheckbox
      />
    );
  }
}

export default RenegotiateFinalOffer;
