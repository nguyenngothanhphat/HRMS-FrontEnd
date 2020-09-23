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

// const list = rookieList;
const { ID, NAME, POSITION, LOCATION, COMMENT, ACTION } = COLUMN_NAME;
const { DISCARDED_FINAL_OFFERS } = TABLE_TYPE;

class DiscardedFinalOffers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { discardedFinalOffers = [] } = this.props;

    return (
      <OnboardTable
        list={discardedFinalOffers}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ACTION]}
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
