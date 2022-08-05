import React, { PureComponent } from 'react';

import { ONBOARDING_COLUMN_NAME, ONBOARDING_TABLE_TYPE } from '@/constants/onboarding';
import OnboardTable from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable';

const {
  ID,
  NAME,
  POSITION,
  LOCATION,
  DATE_JOIN,
  ASSIGN_TO,
  ASSIGNEE_MANAGER,
  PROCESS_STATUS,
  ACTION,
} = ONBOARDING_COLUMN_NAME;
const { JOINED } = ONBOARDING_TABLE_TYPE;

class JoinedTab extends PureComponent {
  render() {
    const {
      list = [],
      loading,
      pageSelected,
      size,
      total,
      getPageAndSize = () => {},
      loadingSearch,
    } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[
          ID,
          NAME,
          POSITION,
          DATE_JOIN,
          LOCATION,
          ASSIGN_TO,
          ASSIGNEE_MANAGER,
          PROCESS_STATUS,
          ACTION,
        ]}
        type={JOINED}
        inTab
        loadingFetch={loading}
        loadingSearch={loadingSearch}
        pageSelected={pageSelected}
        size={size}
        total={total}
        getPageAndSize={getPageAndSize}
      />
    );
  }
}

export default JoinedTab;
