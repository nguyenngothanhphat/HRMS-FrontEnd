import React, { useEffect } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs } from 'antd';
import { history, connect } from 'umi';
import { includes } from 'lodash';
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
    if (!advanced) {
      dispatch({
        type: 'searchAdvance/save',
        // payload: { isSearch: true },
      });
      history.push(`/search-result/${key}`);
    } else {
      history.push(`/search-result/${key}/advanced-search`);
    }
  };
  const findRole = (roles) => {
    return includes(roles, 'hr-manager') || includes(roles, 'hr');
  };
  const listRole = localStorage.getItem('antd-pro-authority');
  const roleHR = findRole(JSON.parse(listRole));

  return (
    <PageContainer>
      <div className={styles.root}>
        <div className={styles.tabs}>
          <Tabs activeKey={tabName} onChange={changeTab}>
            <TabPane tab="Employees" key="employees">
              {!advanced ? <EmployeeResult tabName="employees" /> : <AdvancedSearchEmployee />}
            </TabPane>
            {roleHR && (
              <TabPane tab="Documents" key="documents">
                {!advanced ? <DocumentResult tabName="documents" /> : <AdvancedSearchDocument />}
              </TabPane>
            )}
            <TabPane tab="Tickets" key="tickets">
              {!advanced ? <TicketResult tabName="tickets" /> : <AdvancedSearchTicket />}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
});
export default connect(({ searchAdvance }) => ({ searchAdvance }))(SearchResult);
