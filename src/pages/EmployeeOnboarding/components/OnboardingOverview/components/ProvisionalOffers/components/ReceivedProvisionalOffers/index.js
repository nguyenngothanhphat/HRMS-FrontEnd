import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';

import styles from './index.less';

const { ID, NAME, POSITION, LOCATION, DATE_RECEIVED, ACTION } = COLUMN_NAME;
const { RECEIVED_PROVISIONAL_OFFERS } = TABLE_TYPE;

class ReceivedProvisionalOffers extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { list = [] } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, DATE_RECEIVED, ACTION]}
        type={RECEIVED_PROVISIONAL_OFFERS}
        inTab
      />
    );
  }
}

export default ReceivedProvisionalOffers;
