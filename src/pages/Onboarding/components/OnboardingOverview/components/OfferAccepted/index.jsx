import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import OfferAcceptedTab from './components/OfferAcceptedTab';

import styles from '../index.less';

const { TabPane } = Tabs;

@connect(
  ({
    loading,
    onboarding: { onboardingOverview: { offerAccepted = [], total = 0 } = {} } = {},
  }) => ({
    offerAccepted,
    total,
    loading: loading.effects['onboarding/fetchOnboardList'],
  }),
)
class OfferAccepted extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      size: 10,
      // nameSearch: '',
    };
  }

  componentDidMount = () => {
    this.fetchOnboardingOfferAccepted();
  };

  fetchOnboardingOfferAccepted = () => {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'onboarding/fetchOnboardList',
        payload: {
          processStatus: NEW_PROCESS_STATUS.OFFER_ACCEPTED,
          //   name: nameSearch,
        },
      });
    }
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  render() {
    const { offerAccepted: data = [], total = 0, loading } = this.props;
    const { tabId, pageSelected, size } = this.state;
    return (
      <div className={styles.onboardingTab}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey={tabId}
            onChange={this.onChangeTab}
            tabBarExtraContent={
              <Input onChange={this.onChange} placeholder="Search" prefix={<SearchOutlined />} />
            }
          >
            <TabPane tab="Offer Accepted" key="1">
              <OfferAcceptedTab
                list={data}
                loading={loading}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default OfferAccepted;
