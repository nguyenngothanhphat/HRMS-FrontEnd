import { Badge, Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { addZeroToNumber } from '@/utils/utils';
import MultipleCheckTablePopup from '@/components/MultipleCheckTablePopup';
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
        inProgressLength = 0,
        approvedLength = 0,
        rejectedLength = 0,
        draftLength = 0,
        withdrawnLength = 0,
        deletedLength = 0,
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
                  <span>In Progress ({addZeroToNumber(inProgressLength)}) </span>
                </Badge>
              ) : (
                <span>In Progress ({addZeroToNumber(inProgressLength)}) </span>
              )
            }
            key="1"
          />
          <TabPane tab={`Approved (${addZeroToNumber(approvedLength)})`} key="2" />
          <TabPane tab={`Rejected (${addZeroToNumber(rejectedLength)})`} key="3" />
          {category === 'MY' && (
            <TabPane tab={`Drafts (${addZeroToNumber(draftLength)})`} key="4" />
          )}
          <TabPane tab={`Withdrawn (${addZeroToNumber(withdrawnLength)})`} key="5" />
          {category !== 'MY' && (
            <TabPane tab={`Deleted (${addZeroToNumber(deletedLength)})`} key="6" />
          )}
        </Tabs>
      </div>
    );
  }
}
export default FilterBar;
