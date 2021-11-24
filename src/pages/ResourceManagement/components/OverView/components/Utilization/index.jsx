import { Card, Tabs } from 'antd';
import React from 'react';
import Latest from './components/Latest';
import Trend from './components/Trend';
import styles from './index.less';

const { TabPane } = Tabs;

const Utilization = () => {
  return (
    <Card title="Resource Utilization" className={styles.Utilization}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Latest" key="1">
          <Latest />
        </TabPane>
        <TabPane tab="Trend" key="2">
          <Trend />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Utilization;
