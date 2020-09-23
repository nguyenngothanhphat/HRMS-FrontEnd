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
const { INELIGIBLE_CANDIDATES } = TABLE_TYPE;

class IneligibleCandidates extends Component {
  constructor(props) {
    super(props);
    // const { ineligibleCandidates } = this.props;
    // console.log(this.props);
  }

  render() {
    const { ineligibleCandidates } = this.props;
    return (
      <OnboardTable
        // list={list}
        list={ineligibleCandidates}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ACTION]}
        type={INELIGIBLE_CANDIDATES}
      />
    );
  }
}

// export default IneligibleCandidates;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { ineligibleCandidates = [] } = onboardingOverview;
  return {
    ineligibleCandidates,
  };
})(IneligibleCandidates);
