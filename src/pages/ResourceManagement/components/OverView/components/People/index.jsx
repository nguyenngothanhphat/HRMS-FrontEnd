import { Card, Dropdown, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import CommonTable from '../CommonTable';
import styles from './index.less';
import CustomSearchBox from '@/components/CustomSearchBox';

const TYPE = {
  JOB_TITLE: '1',
  DIVISION: '2',
};
const People = (props) => {
  const {
    dispatch,
    loadingFetch = false,
    resourceManagement: {
      utilizationOverviewList = [],
      selectedLocations = [],
      selectedDivisions = [],
    } = {},
  } = props;
  const [filterMode, setFilterMode] = useState(TYPE.DIVISION); // division,
  const [searchValue, setSearchValue] = useState('');

  const fetchData = () => {
    const payload = {
      selectedLocations,
      selectedDivisions,
    };
    if (searchValue) {
      payload.searchValue = searchValue;
    }

    if (filterMode === TYPE.DIVISION) {
      dispatch({
        type: 'resourceManagement/fetchUtilizationOverviewDivisionList',
        payload,
      });
    }
    if (filterMode === TYPE.JOB_TITLE) {
      dispatch({
        type: 'resourceManagement/fetchUtilizationOverviewTitleList',
        payload,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    filterMode,
    searchValue,
    JSON.stringify(selectedLocations),
    JSON.stringify(selectedDivisions),
  ]);

  const generateColumns = () => {
    const columns = [
      {
        title: 'Job Title',
        dataIndex: '_id',
        key: '_id',
        render: (_id) => {
          return <span>{_id || '-'}</span>;
        },
        sorter: {
          compare: (a, b) => a._id.localeCompare(b._id),
        },
        defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'No. of people',
        dataIndex: 'count',
        key: 'count',
        width: '30%',
        align: 'center',
        render: (count) => {
          return <span>{count || '-'}</span>;
        },
      },
    ];

    return columns;
  };

  const renderFilterMode = () => {
    if (filterMode === TYPE.DIVISION) return 'Division';
    return 'Job Title';
  };

  const onClick = ({ key }) => {
    setFilterMode(key);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key={TYPE.DIVISION}>Division</Menu.Item>
      <Menu.Item key={TYPE.JOB_TITLE}>Job Title</Menu.Item>
    </Menu>
  );

  const renderPlaceholder = () => {
    if (filterMode === TYPE.DIVISION) return 'Search by Division';
    return 'Search by Job Title';
  };

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onChangeSearch = (e) => {
    const formatValue = e.target.value.toLowerCase();
    onSearchDebounce(formatValue);
  };

  const renderOption = () => {
    return (
      <div className={styles.optionContainer}>
        <Dropdown overlay={menu}>
          <div className={styles.filterMode} onClick={(e) => e.preventDefault()}>
            <span>{renderFilterMode()}</span>
            <img src={SmallDownArrow} alt="" />
          </div>
        </Dropdown>
        <CustomSearchBox placeholder={renderPlaceholder()} onSearch={onChangeSearch} />
      </div>
    );
  };

  return (
    <Card title="People" extra={renderOption()} className={styles.People}>
      <div className={styles.tableContainer}>
        <CommonTable
          columns={generateColumns()}
          loading={loadingFetch}
          list={utilizationOverviewList}
          scrollable
        />
      </div>
    </Card>
  );
};

export default connect(({ resourceManagement, loading }) => ({
  resourceManagement,
  loadingFetch:
    loading.effects['resourceManagement/fetchUtilizationOverviewDivisionList'] ||
    loading.effects['resourceManagement/fetchUtilizationOverviewTitleList'],
}))(People);
