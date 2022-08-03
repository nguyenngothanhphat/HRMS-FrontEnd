import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import CustomSearchBox from '@/components/CustomSearchBox';
import Custom from './components/Custom';
import SystemDefault from './components/SystemDefault';
import SortIcon from './images/sort.svg';
import ViewModeIcon from './images/view.svg';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(
  ({
    loading,
    employeeSetting: { defaultTemplateListOffboarding = [], customTemplateListOffboarding = [] },
  }) => ({
    defaultTemplateListOffboarding,
    customTemplateListOffboarding,
    loadingDefaultTemplateList:
      loading.effects['employeeSetting/fetchDefaultTemplateListOffboarding'],
    loadingCustomTemplateList:
      loading.effects['employeeSetting/fetchCustomTemplateListOffboarding'],
  }),
)
class Templates extends PureComponent {
  fetchData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/fetchDefaultTemplateListOffboarding',
    });
    dispatch({
      type: 'employeeSetting/fetchCustomTemplateListOffboarding',
    });
  };

  operations = () => {
    return (
      <div className={styles.operations}>
        <CustomSearchBox />
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
      defaultTemplateListOffboarding,
      loadingDefaultTemplateList,
      customTemplateListOffboarding,
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
              <SystemDefault
                list={defaultTemplateListOffboarding}
                loading={loadingDefaultTemplateList}
              />
            </TabPane>
            <TabPane tab="Custom created" key="2">
              <Custom list={customTemplateListOffboarding} loading={loadingCustomTemplateList} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default FinalOfferDrafts;
export default Templates;
