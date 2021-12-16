import React, { Component } from 'react';
import { Tabs, Badge } from 'antd';
// import moment from 'moment';
import { connect } from 'umi';
import MultipleCheckTablePopup from '@/components/MultipleCheckTablePopup';
import styles from './index.less';

const { TabPane } = Tabs;
@connect(({ timeOff }) => ({
  timeOff,
}))
class FilterBar extends Component {
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
        onHoldLength = '',
        deletedLength = '',
      } = {},
      category = '',
      timeOff: { currentFilterTab = '' } = {},
      handlePackage = {},
    } = this.props;
    const { length = 0 } = handlePackage;

    const withdrawExist = onHoldLength > 0;
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

          <TabPane
            tab={
              withdrawExist ? (
                <Badge dot>
                  <span>Withdrawn ({this.addZeroToNumber(onHoldLength)}) </span>
                </Badge>
              ) : (
                <span>Withdrawn ({this.addZeroToNumber(onHoldLength)}) </span>
              )
            }
            key="5"
          />

          {deletedLength !== 0 && category !== 'MY' && (
            <TabPane tab={`Deleted (${this.addZeroToNumber(deletedLength)})`} key="6" />
          )}
        </Tabs>
      </div>
    );
  }
}
export default FilterBar;
