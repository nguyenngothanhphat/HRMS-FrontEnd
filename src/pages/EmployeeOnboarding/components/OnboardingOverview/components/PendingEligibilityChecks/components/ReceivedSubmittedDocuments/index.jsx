import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable/index';

const { ID, NAME, POSITION, LOCATION, DATE_RECEIVED, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } =
  COLUMN_NAME;
const { RECEIVED_SUBMITTED_DOCUMENTS } = TABLE_TYPE;

class ReceivedSubmittedDocuments extends PureComponent {
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
          DATE_RECEIVED,
          ASSIGN_TO,
          ASSIGNEE_MANAGER,
          ACTION,
        ]}
        type={RECEIVED_SUBMITTED_DOCUMENTS}
        inTab
      />
    );
  }
}

export default ReceivedSubmittedDocuments;
