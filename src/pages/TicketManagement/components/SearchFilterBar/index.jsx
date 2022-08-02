/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import FilterForm from './components/FilterForm';
import styles from './index.less';

const SearchFilterBar = (props) => {
  const {
    dispatch,
    onChangeSearch = () => {},
    ticketManagement: { filter = {} },
  } = props;

  const [filterVisible, setFilterVisible] = useState(false);

  const onClearFilter = () => {
    dispatch({
      type: 'ticketManagement/clearFilter',
    });
  };

  useEffect(() => {
    return () => {
      onClearFilter();
    };
  }, []);

  const applied = Object.keys(filter).length;
  return (
    <div className={styles.SearchFilterBar}>
      <FilterCountTag count={applied} onClearFilter={onClearFilter} />
      <FilterPopover
        content={<FilterForm visible={filterVisible} {...props} />}
        placement="bottomRight"
        visible={filterVisible}
        onVisibleChange={() => setFilterVisible(!filterVisible)}
      >
        <CustomOrangeButton fontSize={14} showDot={applied > 0} />
      </FilterPopover>

      <CustomSearchBox
        placeholder="Search by Requester Name"
        onSearch={(e) => onChangeSearch(e.target.value)}
      />
    </div>
  );
};

export default connect(({ ticketManagement = {} }) => ({ ticketManagement }))(SearchFilterBar);
