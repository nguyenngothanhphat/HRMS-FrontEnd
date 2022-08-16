import { Badge, Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { addZeroToNumber } from '@/utils/utils';
import MultipleCheckTablePopup from '@/components/MultipleCheckTablePopup';
import styles from './index.less';
import { LEAVE_QUERY_TYPE } from '@/constants/timeOff';

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
      totalByStatus: {
        'IN-PROGRESS': IN_PROGRESS = 0,
        'ON-HOLD': ON_HOLD = 0,
        ACCEPTED = 0,
        REJECTED = 0,
        DRAFTS = 0,
        WITHDRAWN = 0,
        DELETED = 0,
      } = {},
      category = '',
      timeOff: { currentFilterTab = '' } = {},
      handlePackage = {},
    } = this.props;
    const { length = 0 } = handlePackage;

    const IN_PROGRESS_ON_HOLD = IN_PROGRESS + ON_HOLD;

    return (
      <div className={styles.FilterBar}>
        <Tabs
          activeKey={currentFilterTab}
          onChange={(activeKey) => this.onChangeTab(activeKey)}
          tabBarExtraContent={
            length > 0 && currentFilterTab === '1' ? this.renderActionBtn() : null
          }
        >
          <TabPane
            tab={
              IN_PROGRESS_ON_HOLD ? (
                <Badge dot>
                  <span>In Progress ({addZeroToNumber(IN_PROGRESS_ON_HOLD)}) </span>
                </Badge>
              ) : (
                <span>In Progress ({addZeroToNumber(IN_PROGRESS_ON_HOLD)}) </span>
              )
            }
            key="1"
          />
          <TabPane tab={`Approved (${addZeroToNumber(ACCEPTED)})`} key="2" />
          <TabPane tab={`Rejected (${addZeroToNumber(REJECTED)})`} key="3" />
          {category === LEAVE_QUERY_TYPE.SELF && (
            <TabPane tab={`Drafts (${addZeroToNumber(DRAFTS)})`} key="4" />
          )}
          <TabPane tab={`Withdrawn (${addZeroToNumber(WITHDRAWN)})`} key="5" />
          {category !== LEAVE_QUERY_TYPE.SELF && (
            <TabPane tab={`Deleted (${addZeroToNumber(DELETED)})`} key="6" />
          )}
        </Tabs>
      </div>
    );
  }
}
export default FilterBar;
