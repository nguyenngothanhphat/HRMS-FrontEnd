import React, { PureComponent } from 'react';
import { connect } from 'umi';

import {
  // rookieList,
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable/index';

// const list = rookieList;
const { ID, NAME, POSITION, LOCATION, COMMENT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } = COLUMN_NAME;
const { DISCARDED_FINAL_OFFERS } = TABLE_TYPE;

class DiscardedFinalOffers extends PureComponent {
  render() {
    const { discardedFinalOffers = [] } = this.props;

    return (
      <OnboardTable
        list={discardedFinalOffers}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION]}
        type={DISCARDED_FINAL_OFFERS}
      />
    );
  }
}

// export default DiscardedFinalOffers;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { discardedFinalOffers = [] } = onboardingOverview;
  return {
    discardedFinalOffers,
  };
})(DiscardedFinalOffers);
