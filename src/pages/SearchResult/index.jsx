import React, { useState } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs } from 'antd';
import { connect, history } from 'umi';
import styles from './index.less';
import EmployeeResult from './components/EmployeesResult/index';
import DocumentResult from './components/DocumentResult/index';
import TicketResult from './components/TicketResult/index';

const { TabPane } = Tabs;

const SearchResult = (props) => {
  const { match: { params: { tabName = 'employees' } = {} } = {} } = props;

  return (
    <PageContainer>
      <div className={styles.root}>
        <div className={styles.tabs}>
          <Tabs
            activeKey={tabName}
            onChange={(key) => {
              history.push(`/search-result/${key}`);
            }}
          >
            <TabPane tab="Employees" key="employees">
              <EmployeeResult />
            </TabPane>
            <TabPane tab="Documents" key="documents">
              <DocumentResult />
            </TabPane>
            <TabPane tab="Tickets" key="tickets">
              <TicketResult />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};
export default SearchResult;
