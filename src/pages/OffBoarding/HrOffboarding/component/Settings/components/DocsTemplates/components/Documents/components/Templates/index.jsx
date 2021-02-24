import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs, Input } from 'antd';
import styles from './index.less';
import SystemDefault from './components/SystemDefault';
import Custom from './components/Custom';
import SortIcon from './images/sort.svg';
import ViewModeIcon from './images/view.svg';
import SearchIcon from './images/search.svg';

const { TabPane } = Tabs;

@connect(({ loading, employeeSetting: { defaultTemplateList = [], customTemplateList = [] } }) => ({
  defaultTemplateList,
  customTemplateList,
  loadingDefaultTemplateList: loading.effects['employeeSetting/fetchDefaultTemplateList'],
  loadingCustomTemplateList: loading.effects['employeeSetting/fetchCustomTemplateList'],
}))
class Templates extends PureComponent {
  fetchData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/fetchDefaultTemplateList',
    });
    dispatch({
      type: 'employeeSetting/fetchCustomTemplateList',
    });
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
      defaultTemplateList,
      loadingDefaultTemplateList,
      customTemplateList,
      loadingCustomTemplateList,
    } = this.props;

    return (
      <div className={styles.Templates}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey="1"
            onTabClick={this.fetchData}
            tabBarExtraContent={this.operations()}
          >
            <TabPane tab="System Default Templates" key="1">
              <SystemDefault list={defaultTemplateList} loading={loadingDefaultTemplateList} />
            </TabPane>
            <TabPane tab="Custom Documents" key="2">
              <Custom list={customTemplateList} loading={loadingCustomTemplateList} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default FinalOfferDrafts;
export default Templates;
