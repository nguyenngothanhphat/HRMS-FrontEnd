import { Skeleton } from 'antd';
import moment from 'moment';
import React, { Suspense } from 'react';
import { connect } from 'umi';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { DATE_FORMAT_YMD } from '@/constants/dateFormat';
import styles from './index.less';

const FilterForm = React.lazy(() => import('./components/FilterForm'));

const SearchFilterBar = ({
  onChangeSearch = () => {},
  activeTab = {},
  filter = {},
  setFilter = () => {},
}) => {
  const onFilter = (values = {}) => {
    let payload = {
      ...values,
    };
    if (payload.fromDate || payload.toDate) {
      const _fromDate =
        (payload.fromDate && moment(payload.fromDate).format(DATE_FORMAT_YMD)) || null;
      const _toDate = (payload.toDate && moment(payload.toDate).format(DATE_FORMAT_YMD)) || null;

      payload = {
        ...payload,
        fromDate: _fromDate,
        toDate: _toDate,
      };
    }

    setFilter(values);
  };

  const applied = Object.values(filter).filter((v) => v).length;

  return (
    <div className={styles.SearchFilterBar}>
      <FilterCountTag
        count={applied}
        onClearFilter={() => {
          setFilter({});
        }}
      />

      <FilterPopover
        content={
          <Suspense fallback={<Skeleton active />}>
            <FilterForm onFilter={onFilter} filter={filter} activeTab={activeTab} />
          </Suspense>
        }
        placement="bottomRight"
      >
        <CustomOrangeButton />
      </FilterPopover>

      <CustomSearchBox
        onSearch={(e) => onChangeSearch(e.target.value)}
        placeholder="Search by name or ID"
      />
    </div>
  );
};

export default connect(
  ({ onboarding: { onboardingOverview: { currentStatus = '' } = {} } = {} }) => ({
    currentStatus,
  }),
)(SearchFilterBar);
