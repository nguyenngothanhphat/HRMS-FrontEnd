/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterPopover from '@/components/FilterPopover';
import FilterCount from '../FilterCount';
import FilterForm from './components/FilterForm';
import styles from './index.less';

const SearchFilterBar = (props) => {
  const {
    dispatch,
    onChangeSearch = () => {},
    ticketManagement: { filter = {} },
    setPageSelected = () => {},
  } = props;

  const [filterVisible, setFilterVisible] = useState(false);
  const [filterForm, setFilterForm] = useState();

  useEffect(() => {
    return () => {
      dispatch({
        type: 'ticketManagement/clearFilter',
      });
    };
  }, []);

  const isFiltering = Object.keys(filter).length > 0;
  return (
    <div className={styles.SearchFilterBar}>
      <FilterCount
        form={filterForm}
        applied={Object.keys(filter).length}
        setPageSelected={setPageSelected}
      />
      <FilterPopover
        content={<FilterForm visible={filterVisible} setFilterForm={setFilterForm} {...props} />}
        placement="bottomRight"
        visible={filterVisible}
        onVisibleChange={() => setFilterVisible(!filterVisible)}
      >
        <CustomOrangeButton fontSize={14} showDot={isFiltering} />
      </FilterPopover>

      <CustomSearchBox
        placeholder="Search by Requester Name"
        onSearch={(e) => onChangeSearch(e.target.value)}
      />
    </div>
  );
};

export default connect(({ ticketManagement = {} }) => ({ ticketManagement }))(SearchFilterBar);
