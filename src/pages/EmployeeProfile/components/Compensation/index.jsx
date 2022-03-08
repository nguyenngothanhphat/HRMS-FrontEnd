import { Spin, Tabs } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import EmptyComponent from '@/components/Empty';
import CompensationSummary from './CompensationSummary';
import PaySlips from './PaySlips';
import BankAccount from './BankAccount';
import Form16 from './Form16';
import TaxWithholdingInfo from './TaxWithholdingInfo';
import WorkInProgress from '@/components/WorkInProgress';

import styles from './index.less';

const { TabPane } = Tabs;

const Compensation = (props) => {
  const data = [];
  const { loadingFetch } = props;
  const [activeKey, setActiveKey] = useState('1');

  const loading = () => {
    if (loadingFetch)
      return (
        <div className={styles.loadingContainer}>
          <Spin />
        </div>
      );
    return '';
  };

  return (
    <div className={styles.Compensation}>
      {data.length === 0 && <WorkInProgress />}
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)} destroyInactiveTabPane>
        <TabPane tab="Compensation Summary" key="1">
          <CompensationSummary />
        </TabPane>
        <TabPane tab="Pay Slips" key="2">
          <PaySlips />
        </TabPane>
        <TabPane tab="Form 16" key="3">
          <Form16 />
        </TabPane>
        <TabPane tab="Bank Account" key="4">
          <BankAccount />
        </TabPane>
        <TabPane tab="Tax Withholding Info" key="5">
          <TaxWithholdingInfo />
        </TabPane>
        <TabPane tab="Stocks" key="6">
          <EmptyComponent />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ employeeProfile, loading }) => ({
  employeeProfile,
  loadingFetch: loading.effects['employeeProfile/getBenefitPlans'],
}))(Compensation);
