import React, { PureComponent } from 'react';

import {
  COLUMN_NAME,
  NEW_TABLE_TYPE,
} from '@/pages/Onboarding/components/OnboardingOverview/components/utils';
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
} = COLUMN_NAME;
const { DRAFT } = NEW_TABLE_TYPE;

class DraftTab extends PureComponent {
  render() {
    const { list = [], loading, pageSelected, size, total, getPageAndSize = () => {} } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[
          ID,
          NAME,
          POSITION,
          LOCATION,
          DATE_JOIN,
          ASSIGN_TO,
          ASSIGNEE_MANAGER,
          PROCESS_STATUS,
          ACTION,
        ]}
        type={DRAFT}
        inTab
        loadingFetch={loading}
        pageSelected={pageSelected}
        size={size}
        total={total}
        getPageAndSize={getPageAndSize}
      />
    );
  }
}

export default DraftTab;
