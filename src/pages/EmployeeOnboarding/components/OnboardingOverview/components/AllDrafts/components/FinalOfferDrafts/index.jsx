import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

const { ID, NAME, POSITION, LOCATION, DATE_JOIN, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } =
  COLUMN_NAME;
const { FINAL_OFFERS_DRAFTS } = TABLE_TYPE;

class FinalOfferDrafts extends PureComponent {
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
        type={FINAL_OFFERS_DRAFTS}
        inTab
        pageSelected={pageSelected}
        size={size}
        total={total}
        getPageAndSize={getPageAndSize}
      />
    );
  }
}

export default FinalOfferDrafts;
