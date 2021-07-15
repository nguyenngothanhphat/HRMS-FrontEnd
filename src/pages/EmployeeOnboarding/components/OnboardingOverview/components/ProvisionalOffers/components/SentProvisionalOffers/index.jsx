import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable/index';

const { ID, NAME, POSITION, LOCATION, DATE_SENT, ACTION, EXPIRE, ASSIGN_TO, ASSIGNEE_MANAGER } =
  COLUMN_NAME;
const { SENT_PROVISIONAL_OFFERS } = TABLE_TYPE;

class SentProvisionalOffers extends PureComponent {
  render() {
    const { list = [], pageSelected, size, total, getPageAndSize = () => {} } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[
          ID,
          NAME,
          POSITION,
          LOCATION,
          DATE_SENT,
          EXPIRE,
          ASSIGN_TO,
          ASSIGNEE_MANAGER,
          ACTION,
        ]}
        type={SENT_PROVISIONAL_OFFERS}
        inTab
        pageSelected={pageSelected}
        size={size}
        total={total}
        getPageAndSize={getPageAndSize}
      />
    );
  }
}

export default SentProvisionalOffers;
