import { Tabs } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import OnboardingLayout from '@/components/OnboardingLayout';
import { MENU_DATA } from '@/constants/onboarding';
import useCancelToken from '@/utils/hooks';
import { debounceFetchData } from '@/utils/utils';
import OnboardTable from './components/OnboardTable';
import SearchFilterBar from './components/SearchFilterBar';
import styles from './index.less';

const OnboardingOverview = (props) => {
  const {
    dispatch,
    type,
    loadingFetch = false,
    onboarding: { onboardingOverview: { onboardingData = [], total = 0 } = {} } = {},
  } = props;

  const activeTab = MENU_DATA.find((x) => x.link === type) || MENU_DATA[0];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState({});
  const { cancelToken, cancelRequest } = useCancelToken();
  const { cancelToken: cancelToken2, cancelRequest: cancelRequest2 } = useCancelToken();

  const fetchData = () => {
    dispatch({
      type: 'onboarding/fetchOnboardList',
      payload: {
        name: searchValue,
        processStatus: activeTab.processStatus,
        cancelToken: cancelToken(),
        ...filter,
      },
    });

    dispatch({
      type: 'onboarding/fetchTotalNumberOfOnboardingListEffect',
      payload: {
        cancelToken: cancelToken2(),
      },
    });
  };

  useEffect(() => {
    debounceFetchData(fetchData);
    return () => {
      cancelRequest();
      cancelRequest2();
    };
  }, [searchValue, JSON.stringify(activeTab), JSON.stringify(filter)]);

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l);
  };

  useEffect(() => {
    onChangePage(1, 10);
  }, [JSON.stringify(activeTab)]);

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (value) => {
    onSearchDebounce(value.toLowerCase());
  };

  useEffect(() => {
    dispatch({
      type: 'employeeSetting/save',
      payload: {
        activeTabDocument: '1',
        activeTabCustomEmail: '1',
      },
    });
    dispatch({
      type: 'newCandidateForm/fetchDocumentsCheckList',
    });
  }, []);

  return (
    <div className={styles.OnboardingOverview}>
      <OnboardingLayout type={type} activeTab={activeTab}>
        <div className={styles.tableContainer}>
          <div className={styles.tabs}>
            <Tabs
              defaultActiveKey="all"
              tabBarExtraContent={
                <SearchFilterBar
                  onChangeSearch={onSearch}
                  filter={filter}
                  setFilter={setFilter}
                  activeTab={activeTab}
                />
              }
            >
              <Tabs.TabPane key="1">
                <OnboardTable
                  list={onboardingData}
                  activeTab={activeTab}
                  page={page}
                  limit={limit}
                  loading={loadingFetch}
                  total={total}
                  onChangePage={onChangePage}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </OnboardingLayout>
    </div>
  );
};

export default connect(({ loading, onboarding = {} }) => ({
  onboarding,
  loadingFetch: loading.effects['onboarding/fetchOnboardList'],
}))(OnboardingOverview);
