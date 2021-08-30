import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import styles from './index.less';

const { TabPane } = Tabs;

@connect()
class Draft extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabId: '1',
      pageSelected: 1,
      size: 10,
      // nameSearch: '',
    };
  }

  render() {
    const { tabId, pageSelected, size } = this.state;
    return (
      <div className={styles.AllDrafts}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey={tabId}
            onChange={this.onChangeTab}
            tabBarExtraContent={
              <Input onChange={this.onChange} placeholder="Search" prefix={<SearchOutlined />} />
            }
          >
            {/* <TabPane
              tab="draft"
              key="1"
            >
              <AllTab
                list={dataAll}
                loading={loadingAll}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane> */}
            {/* <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="provisional offer drafts"
              key="2"
            >
              <ProvisionalOfferDrafts
                list={provisionalOfferDrafts}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane> */}
            {/* <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="final offers draft"
              key="3"
            >
              <FinalOfferDrafts
                list={finalOfferDrafts}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Draft;
