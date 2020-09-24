import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';

import {
  // rookieList,
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import styles from './index.less';

// const list = rookieList.filter((rookie) => rookie.isNew != true);
// console.log(list);
const { ID, NAME, POSITION, LOCATION, COMMENT, ACTION } = COLUMN_NAME;
const { DISCARDED_PROVISIONAL_OFFERS } = TABLE_TYPE;

class DiscardedProvisionalOffers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { discardedProvisionalOffers = [] } = this.props;

    return (
      <OnboardTable
        list={discardedProvisionalOffers}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ACTION]}
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
