import React, { PureComponent } from 'react';
import { connect } from 'umi';

import {
  // rookieList,
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable/index';

// const list = rookieList.filter((rookie) => rookie.isNew != true);
// console.log(list);
const { ID, NAME, POSITION, LOCATION, COMMENT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } = COLUMN_NAME;
const { DISCARDED_PROVISIONAL_OFFERS } = TABLE_TYPE;

class DiscardedProvisionalOffers extends PureComponent {
  render() {
    const { discardedProvisionalOffers = [] } = this.props;

    return (
      <OnboardTable
        list={discardedProvisionalOffers}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION]}
        type={DISCARDED_PROVISIONAL_OFFERS}
      />
    );
  }
}

// export default DiscardedProvisionalOffers;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { discardedProvisionalOffers = [] } = onboardingOverview;
  return {
    discardedProvisionalOffers,
  };
})(DiscardedProvisionalOffers);
