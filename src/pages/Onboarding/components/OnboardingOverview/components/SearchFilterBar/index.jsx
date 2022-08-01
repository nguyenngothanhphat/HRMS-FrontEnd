import { CloseOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import FilterPopover from '@/components/FilterPopover';
import CustomSearchBox from '@/components/CustomSearchBox';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import FilterForm from './components/FilterForm';
import styles from './index.less';

const SearchFilterBar = ({ onChangeSearch = () => {}, currentStatus = '' }) => {
  const [applied, setApplied] = useState(0);
  const [filter, setFilter] = useState({});

  const onClose = () => {
    setApplied(0);
    setFilter({});
  };

  useEffect(() => {
    const filteredObj = Object.entries(filter).filter(
      ([, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
  }, [JSON.stringify(filter)]);

  return (
    <div className={styles.SearchFilterBar}>
      {((applied > 0 && currentStatus === 'ALL') || applied > 1) && (
        <Tag
          className={styles.tagCountFilter}
          closable
          onClose={onClose}
          closeIcon={<CloseOutlined />}
        >
          {currentStatus === 'ALL' ? applied : applied - 1} filters applied
        </Tag>
      )}

      <FilterPopover
        content={<FilterForm setFilter={setFilter} filter={filter} />}
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
