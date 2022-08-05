import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { DATE_FORMAT_YMD } from '@/constants/dateFormat';
import FilterForm from './components/FilterForm';
import styles from './index.less';

const SearchFilterBar = ({ dispatch, onChangeSearch = () => {}, currentStatus = '' }) => {
  const [filter, setFilter] = useState({});

  const filterData = () => {
    let payload = { ...filter };
    if (filter.processStatus === undefined && currentStatus !== 'ALL') {
      payload = {
        ...payload,
        processStatus: [currentStatus],
      };
    }

    if (payload.fromDate && payload.toDate) {
      const _fromDate = moment(payload.fromDate).format(DATE_FORMAT_YMD);
      const _toDate = moment(payload.toDate).format(DATE_FORMAT_YMD);
      payload = {
        ...payload,
        fromDate: _fromDate,
        toDate: _toDate,
      };
    }
    dispatch({
      type: 'onboarding/filterOnboardList',
      payload,
    });
  };

  const onFilter = (values = {}) => {
    setFilter(values);
  };

  useEffect(() => {
    filterData();
  }, [JSON.stringify(filter)]);

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
        content={<FilterForm onFilter={onFilter} filter={filter} />}
        placement="bottomRight"
      >
        <CustomOrangeButton showDot={applied > 0} />
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
