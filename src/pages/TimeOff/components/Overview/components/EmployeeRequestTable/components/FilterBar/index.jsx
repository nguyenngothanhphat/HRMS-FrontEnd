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
      dataNumber: {
        inProgressLength = '',
        approvedLength = '',
        rejectedLength = '',
        draftLength = '',
        withdrawnLength = '',
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
          <TabPane tab={`In Progress (${addZeroToNumber(inProgressLength)})`} key="1" />
          <TabPane tab={`Approved (${addZeroToNumber(approvedLength)})`} key="2" />
          <TabPane tab={`Rejected (${addZeroToNumber(rejectedLength)})`} key="3" />
          <TabPane tab={`Drafts (${addZeroToNumber(draftLength)})`} key="4" />
          <TabPane tab={`Withdrawn (${addZeroToNumber(withdrawnLength)})`} key="5" />
        </Tabs>
      </div>
    );
  }
}
export default FilterBar;
