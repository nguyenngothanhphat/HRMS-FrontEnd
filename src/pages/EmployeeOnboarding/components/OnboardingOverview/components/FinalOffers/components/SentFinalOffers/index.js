import React, { Component } from 'react';
import { Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import ModalContent from '../ModalContent';

import styles from './index.less';

const { ID, NAME, POSITION, LOCATION, DATE_JOIN, ACTION } = COLUMN_NAME;
const { SENT_FINAL_OFFERS } = TABLE_TYPE;

class SentFinalOffers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { list = [] } = this.props;

    return (
      <OnboardTable
        list={list}
        columnArr={[ID, NAME, POSITION, LOCATION, DATE_JOIN, ACTION]}
        type={SENT_FINAL_OFFERS}
        inTab
      />
    );
  }
}

export default SentFinalOffers;
