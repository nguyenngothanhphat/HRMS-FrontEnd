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

// const list = rookieList.filter((rookie) => rookie.isNew != true);
const { ID, NAME, POSITION, LOCATION, COMMENT, ACTION } = COLUMN_NAME;
const { PENDING_APPROVALS } = TABLE_TYPE;

class PendingApprovals extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { list = [] } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, COMMENT, ACTION]}
        type={PENDING_APPROVALS}
        inTab
        hasCheckbox
      />
    );
  }
}

export default PendingApprovals;
