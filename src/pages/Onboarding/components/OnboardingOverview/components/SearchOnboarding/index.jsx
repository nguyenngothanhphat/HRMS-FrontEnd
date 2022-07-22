import { CloseOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import FilterPopover from '@/components/FilterPopover';
import FilterButton from '@/components/FilterButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterForm from './components/FilterForm';
import styles from './index.less';

const SearchOnboarding = ({ onChangeSearch = () => {}, currentStatus = '' }) => {
  const [applied, setApplied] = useState(0);
  const [form, setForm] = useState(null);

  const onClose = () => {
    setApplied(0);
    form();
  };

  const callback = (apply) => {
    const filteredObj = Object.entries(apply).filter(
      ([, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
    // console.log(apply, Object.keys(newObj).length);
  };

  const callbackClose = (close) => {
    setForm(close);
  };

  return (
    <div className={styles.search}>
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
        content={<FilterForm callback={callback} callbackClose={callbackClose} />}
        placement="bottomRight"
      >
        <FilterButton />
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
)(SearchOnboarding);
