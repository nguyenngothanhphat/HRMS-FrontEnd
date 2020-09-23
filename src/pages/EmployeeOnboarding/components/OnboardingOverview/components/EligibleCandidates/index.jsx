import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';

import {
  rookieList,
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import styles from './index.less';

// const list = rookieList;
const { ID, NAME, POSITION, LOCATION, COMMENT, ACTION } = COLUMN_NAME;
const { ELIGIBLE_CANDIDATES } = TABLE_TYPE;

class EligibleCandidates extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { eligibleCandidates } = this.props;
    return (
      <OnboardTable
        list={eligibleCandidates}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ACTION]}
        type={ELIGIBLE_CANDIDATES}
      />
    );
  }
}

// export default EligibleCandidates;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { eligibleCandidates = [] } = onboardingOverview;
  return {
    eligibleCandidates,
  };
})(EligibleCandidates);
