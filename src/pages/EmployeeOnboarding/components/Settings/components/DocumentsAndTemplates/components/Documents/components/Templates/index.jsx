import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs, Input } from 'antd';
import styles from './index.less';
import SystemDefault from './components/SystemDefault';
import Recent from './components/Recent';
import SortIcon from './images/sort.svg';
import ViewModeIcon from './images/view.svg';
import SearchIcon from './images/search.svg';

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
class Templates extends PureComponent {
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
      defaultTemplateListOnboarding,
      loadingDefaultTemplateList,
      customTemplateListOnboarding,
      loadingCustomTemplateList,
      fetchData = () => {},
    } = this.props;

    return (
      <div className={styles.Templates}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1" onTabClick={fetchData} tabBarExtraContent={this.operations()}>
            <TabPane tab="System Default Templates" key="1">
              <SystemDefault
                list={defaultTemplateListOnboarding}
                loading={loadingDefaultTemplateList}
              />
            </TabPane>
            <TabPane tab="Recent documents" key="2">
              <Recent list={customTemplateListOnboarding} loading={loadingCustomTemplateList} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default FinalOfferDrafts;
export default Templates;
