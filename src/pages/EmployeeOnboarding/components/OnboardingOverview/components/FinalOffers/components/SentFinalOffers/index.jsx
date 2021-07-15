import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable/index';

const { ID, NAME, POSITION, LOCATION, DATE_SENT, EXPIRE, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } =
  COLUMN_NAME;
const { SENT_FINAL_OFFERS } = TABLE_TYPE;

class SentFinalOffers extends PureComponent {
  render() {
    const { list = [], pageSelected, size, getPageAndSize = () => {}, total } = this.props;

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
        type={SENT_FINAL_OFFERS}
        inTab
        pageSelected={pageSelected}
        size={size}
        total={total}
        getPageAndSize={getPageAndSize}
      />
    );
  }
}

export default SentFinalOffers;
