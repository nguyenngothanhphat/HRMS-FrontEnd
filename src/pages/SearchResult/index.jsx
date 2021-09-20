import React, { useEffect } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs } from 'antd';
import { history, connect } from 'umi';
import styles from './index.less';
import EmployeeResult from './components/EmployeesResult/index';
import DocumentResult from './components/DocumentResult/index';
import TicketResult from './components/TicketResult/index';
import AdvancedSearchEmployee from './components/AdvancedSearchEmployee';
import AdvancedSearchTicket from './components/AdvancedSearchTicket';
import AdvancedSearchDocument from './components/AdvancedSearchDocument';

const { TabPane } = Tabs;

const SearchResult = React.memo((props) => {
  const { match: { params: { tabName, advanced } = {} } = {}, dispatch } = props;
  useEffect(() => {
    if (!tabName) {
      history.replace('search-result/employees');
    }
  }, []);
  const changeTab = (key) => {
    dispatch({
      type: 'searchAdvance/save',
      payload: { isSearch: true },
    });
    history.push(`/search-result/${key}`);
  };
  return (
    <PageContainer>
      <div className={styles.root}>
        <div className={styles.tabs}>
          <Tabs activeKey={tabName} onChange={changeTab}>
            <TabPane tab="Employees" key="employees">
              {!advanced ? <EmployeeResult /> : <AdvancedSearchEmployee />}
            </TabPane>
            <TabPane tab="Documents" key="documents">
              {!advanced ? <DocumentResult /> : <AdvancedSearchDocument />}
            </TabPane>
            <TabPane tab="Tickets" key="tickets">
              {!advanced ? <TicketResult /> : <AdvancedSearchTicket />}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
});
export default connect(({ searchAdvance }) => ({ searchAdvance }))(SearchResult);
