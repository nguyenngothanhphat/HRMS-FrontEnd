import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import {
  rookieList,
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import styles from './index.less';

const list = rookieList.filter((rookie) => rookie.isNew != true);
const { ID, NAME, POSITION, LOCATION, DATE_JOIN, ACTION } = COLUMN_NAME;
const { FINAL_OFFERS_DRAFTS } = TABLE_TYPE;

class FinalOfferDrafts extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <OnboardTable
        list={rookieList}
        columnArr={[ID, NAME, POSITION, LOCATION, DATE_JOIN, ACTION]}
        type={FINAL_OFFERS_DRAFTS}
      />
    );
  }
}

export default FinalOfferDrafts;
