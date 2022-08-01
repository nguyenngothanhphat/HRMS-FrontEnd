import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import { debounce } from 'lodash';

import { NEW_PROCESS_STATUS } from '@/constants/onboarding';
import ProfileVerificationTab from './components/ProfileVerificationTab';

import styles from '../index.less';
import SearchFilterBar from '../SearchFilterBar';

const { TabPane } = Tabs;

@connect(
  ({
    loading,
    onboarding: { onboardingOverview: { profileVerifications = [], total = 0 } = {} } = {},
  }) => ({
    profileVerifications,
    total,
    loading: loading.effects['onboarding/fetchOnboardList'],
  }),
)
class ProfileVerification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      size: 10,
      nameSearch: '',
      loadingSearch: false,
    };

    this.setDebounce = debounce((nameSearch) => {
      this.setState({
        nameSearch,
      });
    }, 500);
  }

  componentDidMount = () => {
    this.fetchOnboardingProfileVerification('');
  };

  componentDidUpdate = (prepProps, prepStates) => {
    const { nameSearch } = this.state;
    if (prepStates.nameSearch !== nameSearch) {
      this.fetchOnboardingProfileVerification(nameSearch);
    }
  };

  fetchOnboardingProfileVerification = (nameSearch = '') => {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'onboarding/fetchOnboardList',
        payload: {
          processStatus: [NEW_PROCESS_STATUS.PROFILE_VERIFICATION],
          name: nameSearch,
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
          this.setState({ loadingSearch: false });
        }
      });
    }
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    // this.setState({ loadingSearch: true });
    this.setDebounce(formatValue);
  };

  render() {
    const { profileVerifications: data = [], total = 0, loading } = this.props;
    const { tabId, pageSelected, size, loadingSearch } = this.state;

    return (
      <div className={styles.onboardingTab}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey={tabId}
            onChange={this.onChangeTab}
            tabBarExtraContent={<SearchFilterBar onChangeSearch={this.onChangeSearch} />}
          >
            <TabPane key="1">
              <ProfileVerificationTab
                list={data}
                loading={loading}
                loadingSearch={loadingSearch}
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

export default ProfileVerification;
