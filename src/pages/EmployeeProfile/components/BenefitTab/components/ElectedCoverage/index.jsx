import { Card, Spin, Tabs } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import EmptyComponent from '@/components/Empty';
import HealthWellbeing from './components/HealthWellbeing';
import styles from './index.less';

const { TabPane } = Tabs;

const ElectedCoverage = (props) => {
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
    <Card title="Elected Coverage" className={styles.ElectedCoverage}>
      {loading()}
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)} destroyInactiveTabPane>
        <TabPane tab="Health & Wellbeing" key="1">
          <HealthWellbeing />
        </TabPane>
        <TabPane tab="Financial" key="2">
          <EmptyComponent />
        </TabPane>
        <TabPane tab="Legal" key="3">
          <EmptyComponent />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default connect(({ employeeProfile, loading }) => ({
  employeeProfile,
  loadingFetch: loading.effects['employeeProfile/getBenefitPlans'],
}))(ElectedCoverage);
