import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { addZeroToNumber } from '@/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;
@connect(({ timeOff }) => ({
  timeOff,
}))
class FilterBar extends PureComponent {
  onChangeTab = (activeKey) => {
    const { setSelectedFilterTab } = this.props;
    setSelectedFilterTab(activeKey);
  };

  render() {
    const {
      totalByStatus: {
        'IN-PROGRESS': IN_PROGRESS = 0,
        'ON-HOLD': ON_HOLD = 0,
        ACCEPTED = 0,
        REJECTED = 0,
        DRAFTS = 0,
        WITHDRAWN = 0,
      } = {},
      timeOff: { currentFilterTab = '' } = {},
    } = this.props;

    return (
      <div className={styles.FilterBar}>
        <Tabs
          // tabBarGutter={35}
          activeKey={currentFilterTab}
          onChange={(activeKey) => this.onChangeTab(activeKey)}
          tabBarExtraContent={this.renderTableTitle}
        >
          <TabPane tab={`In Progress (${addZeroToNumber(IN_PROGRESS + ON_HOLD)})`} key="1" />
          <TabPane tab={`Approved (${addZeroToNumber(ACCEPTED)})`} key="2" />
          <TabPane tab={`Rejected (${addZeroToNumber(REJECTED)})`} key="3" />
          <TabPane tab={`Drafts (${addZeroToNumber(DRAFTS)})`} key="4" />
          <TabPane tab={`Withdrawn (${addZeroToNumber(WITHDRAWN)})`} key="5" />
        </Tabs>
      </div>
    );
  }
}
export default FilterBar;
