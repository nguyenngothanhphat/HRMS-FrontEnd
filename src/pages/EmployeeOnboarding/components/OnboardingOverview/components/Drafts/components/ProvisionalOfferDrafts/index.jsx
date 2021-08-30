import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

const { ID, NAME, POSITION, LOCATION, DATE_JOIN, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } =
  COLUMN_NAME;
const { PROVISIONAL_OFFERS_DRAFTS } = TABLE_TYPE;

class ProvisionalOfferDrafts extends PureComponent {
  render() {
    const {
      list = [],
      pageSelected = '',
      size = '',
      total = '',
      getPageAndSize = () => {},
    } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, DATE_JOIN, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION]}
        type={PROVISIONAL_OFFERS_DRAFTS}
        inTab
        pageSelected={pageSelected}
        size={size}
        tota={total}
        getPageAndSize={getPageAndSize}
      />
    );
  }
}

export default ProvisionalOfferDrafts;
