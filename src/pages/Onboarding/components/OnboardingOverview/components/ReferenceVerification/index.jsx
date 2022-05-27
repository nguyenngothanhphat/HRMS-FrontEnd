import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import { debounce } from 'lodash';

import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import ReferenceVerificationTab from './components/ReferenceVerificationTab';

import styles from '../index.less';
import SearchOnboarding from '../SearchOnboarding';

const { TabPane } = Tabs;

const ReferenceVerification = (props) => {
  const { profileVerifications: data = [], total = 0, loading } = props;
  const [state, setState] = useState({
    pageSelected: 1,
    size: 10,
    nameSearch: '',
    loadingSearch: false,
  });
  const { tabId, pageSelected, size, loadingSearch } = state;

  const setDebounce = debounce((nameSearch) => {
    setState({
      nameSearch,
    });
  }, 500);

  const fetchOnboardingProfileVerification = (nameSearch = '') => {
    const { dispatch } = props;

    if (dispatch) {
      dispatch({
        type: 'onboarding/fetchOnboardList',
        payload: {
          processStatus: [NEW_PROCESS_STATUS.REFERENCE_VERIFICATION],
          name: nameSearch,
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
          setState({ loadingSearch: false });
        }
      });
    }
  };

  useEffect(() => {
    fetchOnboardingProfileVerification('');
  }, []);

  useEffect(() => {
    fetchOnboardingProfileVerification(state.nameSearch);
  }, [state.nameSearch]);

  const getPageAndSize = (page, pageSize) => {
    setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  const onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    // setState({ loadingSearch: true });
    setDebounce(formatValue);
  };

  return (
    <div className={styles.onboardingTab}>
      <div className={styles.tabs}>
        <Tabs
          defaultActiveKey={tabId}
          // onChange={onChangeTab}
          tabBarExtraContent={<SearchOnboarding onChangeSearch={onChangeSearch} />}
        >
          <TabPane key="1">
            <ReferenceVerificationTab
              list={data}
              loading={loading}
              loadingSearch={loadingSearch}
              pageSelected={pageSelected}
              size={size}
              getPageAndSize={getPageAndSize}
              total={total}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default connect(
  ({
    loading,
    onboarding: { onboardingOverview: { profileVerifications = [], total = 0 } = {} } = {},
  }) => ({
    profileVerifications,
    total,
    loading: loading.effects['onboarding/fetchOnboardList'],
  }),
)(ReferenceVerification);
