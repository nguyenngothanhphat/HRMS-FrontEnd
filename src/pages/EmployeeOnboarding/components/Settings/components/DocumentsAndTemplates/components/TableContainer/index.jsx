import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { Input, Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import CommonTable from './components/CommonTable';
import SearchIcon from './images/search.svg';
import SortIcon from './images/sort.svg';
import ViewModeIcon from './images/view.svg';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(
  ({
    loading,
    employeeSetting: { defaultTemplateListOnboarding = [], customTemplateListOnboarding = [] },
  }) => ({
    defaultTemplateListOnboarding,
    customTemplateListOnboarding,
    loadingDefaultTemplateList:
      loading.effects['employeeSetting/fetchDefaultTemplateListOnboarding'],
    loadingCustomTemplateList: loading.effects['employeeSetting/fetchCustomTemplateListOnboarding'],
  }),
)
class TableContainer extends PureComponent {
  fetchData = (key = '1') => {
    const { dispatch } = this.props;
    if (key === '1')
      dispatch({
        type: 'employeeSetting/fetchDocumentListOnboarding',
        payload: {
          tenantId: getCurrentTenant(),
          module: 'ON_BOARDING',
          company: getCurrentCompany(),
        },
      });
    if (key === '2')
      dispatch({
        type: 'employeeSetting/fetchDefaultTemplateListOnboarding',
        payload: {
          tenantId: getCurrentTenant(),
          type: 'ON_BOARDING',
        },
      });
    if (key === '3')
      dispatch({
        type: 'employeeSetting/fetchCustomTemplateListOnboarding',
        payload: {
          tenantId: getCurrentTenant(),
          type: 'ON_BOARDING',
        },
      });
  };

  componentDidMount = () => {
    this.fetchData('1');
  };

  operations = () => {
    return (
      <div className={styles.operations}>
        <div className={styles.searchBox}>
          <Input placeholder="Search" prefix={<img src={SearchIcon} alt="search" />} />
        </div>
        <div className={styles.sortIcon}>
          <img src={SortIcon} alt="sort" />
        </div>
        <div className={styles.viewModeIcon}>
          <img src={ViewModeIcon} alt="viewMode" />
        </div>
      </div>
    );
  };

  render() {
    const {
      defaultTemplateListOnboarding = [],
      loadingDefaultTemplateList = false,
      customTemplateListOnboarding = [],
      loadingCustomTemplateList = false,
      documentListOnboarding = [],
    } = this.props;

    return (
      <div className={styles.TableContainer}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1" onTabClick={(key) => this.fetchData(key)}>
            <TabPane tab="Documents" key="1">
              <CommonTable list={documentListOnboarding} loading={false} inTab />
            </TabPane>
            <TabPane tab="System Default Templates" key="2">
              <CommonTable
                list={defaultTemplateListOnboarding}
                loading={loadingDefaultTemplateList}
                inTab
              />
            </TabPane>
            <TabPane tab="Custom templates" key="3">
              <CommonTable
                list={customTemplateListOnboarding}
                loading={loadingCustomTemplateList}
                inTab
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default TableContainer;
