import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

import styles from './index.less';

const { ID, NAME, POSITION, LOCATION, DATE_JOIN, ACTION } = COLUMN_NAME;
const { FINAL_OFFERS_DRAFTS } = TABLE_TYPE;

class FinalOfferDrafts extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { finalOfferDrafts = [] } = this.props;

    return (
      <OnboardTable
        list={finalOfferDrafts}
        columnArr={[ID, NAME, POSITION, LOCATION, DATE_JOIN, ACTION]}
        type={FINAL_OFFERS_DRAFTS}
      />
    );
  }
}

// export default FinalOfferDrafts;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { finalOfferDrafts = [] } = onboardingOverview;
  return {
    finalOfferDrafts,
  };
})(FinalOfferDrafts);
