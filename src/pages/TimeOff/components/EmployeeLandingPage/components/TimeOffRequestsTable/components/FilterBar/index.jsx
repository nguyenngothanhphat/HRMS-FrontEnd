import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const { TabPane } = Tabs;
@connect(({ timeOff }) => ({
  timeOff,
}))
class FilterBar extends PureComponent {
  saveCurrentTab = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentFilterTab: String(type),
      },
    });
  };

  onChangeTab = (activeKey) => {
    const { setSelectedFilterTab } = this.props;
    setSelectedFilterTab(activeKey);
    this.saveCurrentTab(activeKey);
  };

  addZeroToNumber = (number) => {
    if (number === 0) return 0;
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
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
          <TabPane tab={`In Progress (${this.addZeroToNumber(inProgressLength)})`} key="1" />
          <TabPane tab={`Approved (${this.addZeroToNumber(approvedLength)})`} key="2" />
          <TabPane tab={`Rejected (${this.addZeroToNumber(rejectedLength)})`} key="3" />
          <TabPane tab={`Drafts (${this.addZeroToNumber(draftLength)})`} key="4" />
          <TabPane tab={`Withdrawn (${this.addZeroToNumber(withdrawnLength)})`} key="5" />
        </Tabs>
      </div>
    );
  }
}
export default FilterBar;
