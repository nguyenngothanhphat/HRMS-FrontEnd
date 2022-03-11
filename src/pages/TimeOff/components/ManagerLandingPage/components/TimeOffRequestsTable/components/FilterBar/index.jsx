import React, { PureComponent } from 'react';
import { Tabs, Badge } from 'antd';
import { connect } from 'umi';
import MultipleCheckTablePopup from '@/components/MultipleCheckTablePopup';
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
    const { setSelectedFilterTab, dispatch } = this.props;
    setSelectedFilterTab(activeKey);
    this.saveCurrentTab(activeKey);
    dispatch({
      type: 'timeOff/savePaging',
      payload: { page: 1 },
    });
  };

  addZeroToNumber = (number) => {
    if (number === 0) return 0;
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
  };

  renderActionBtn = () => {
    const { handlePackage = {} } = this.props;
    const { onApprove = () => {}, onReject = () => {}, loading3, loading4 } = handlePackage;
    return (
      <MultipleCheckTablePopup
        onApprove={onApprove}
        onReject={onReject}
        loading3={loading3}
        loading4={loading4}
      />
    );
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
      category = '',
      timeOff: { currentFilterTab = '' } = {},
      handlePackage = {},
    } = this.props;
    const { length = 0 } = handlePackage;

    const inProgressExist = inProgressLength > 0;

    return (
      <div className={styles.FilterBar}>
        <Tabs
          // tabBarGutter={35}
          activeKey={currentFilterTab}
          onChange={(activeKey) => this.onChangeTab(activeKey)}
          tabBarExtraContent={
            length > 0 && currentFilterTab === '1' ? this.renderActionBtn() : null
          }
        >
          <TabPane
            tab={
              inProgressExist ? (
                <Badge dot>
                  <span>In Progress ({this.addZeroToNumber(inProgressLength)}) </span>
                </Badge>
              ) : (
                <span>In Progress ({this.addZeroToNumber(inProgressLength)}) </span>
              )
            }
            key="1"
          />
          <TabPane tab={`Approved (${this.addZeroToNumber(approvedLength)})`} key="2" />
          <TabPane tab={`Rejected (${this.addZeroToNumber(rejectedLength)})`} key="3" />
          {category === 'MY' && (
            <TabPane tab={`Drafts (${this.addZeroToNumber(draftLength)})`} key="4" />
          )}
          <TabPane tab={`Withdrawn (${this.addZeroToNumber(withdrawnLength)})`} key="5" />
        </Tabs>
      </div>
    );
  }
}
export default FilterBar;
