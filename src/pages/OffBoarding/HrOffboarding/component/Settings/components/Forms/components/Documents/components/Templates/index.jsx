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
    const { allDrafts = {} } = this.props;
    const { provisionalOfferDrafts = [], finalOfferDrafts = [] } = allDrafts;

    return (
      <div className={styles.Templates}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1" tabBarExtraContent={this.operations()}>
            <TabPane tab="System Default Templates" key="1">
              <SystemDefault list={provisionalOfferDrafts} />
            </TabPane>
            <TabPane tab="Custom created" key="2">
              <Custom list={finalOfferDrafts} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default FinalOfferDrafts;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { finalOfferDrafts = [], allDrafts = {} } = onboardingOverview;
  return {
    finalOfferDrafts,
    allDrafts,
  };
})(Templates);
