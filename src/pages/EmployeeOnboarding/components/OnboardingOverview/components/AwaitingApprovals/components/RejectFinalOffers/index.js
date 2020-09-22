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
const { ID, NAME, POSITION, LOCATION, COMMENT, ACTION } = COLUMN_NAME;
const { REJECTED_FINAL_OFFERS } = TABLE_TYPE;

class RejectFinalOffers extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ACTION]}
        type={REJECTED_FINAL_OFFERS}
        inTab
      />
    );
  }
}

export default RejectFinalOffers;
