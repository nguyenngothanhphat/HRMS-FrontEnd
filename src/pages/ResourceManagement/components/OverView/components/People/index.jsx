import { Card, Dropdown, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import CommonTable from '../CommonTable';
import styles from './index.less';

const TYPE = {
  JOB_TITLE: '1',
  DIVISION: '2',
};
const People = (props) => {
  const {
    dispatch,
    loadingFetch = false,
    resourceManagement: { utilizationOverviewList = [] } = {},
  } = props;
  const [filterMode, setFilterMode] = useState(TYPE.JOB_TITLE); // division,

  const fetchData = () => {
    if (filterMode === TYPE.DIVISION) {
      dispatch({
        type: 'resourceManagement/fetchUtilizationOverviewDivisionList',
      });
    }
    if (filterMode === TYPE.JOB_TITLE) {
      dispatch({
        type: 'resourceManagement/fetchUtilizationOverviewTitleList',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterMode]);

  const generateColumns = () => {
    const columns = [
      {
        title: 'Job Title',
        dataIndex: '_id',
        key: '_id',
        render: (_id) => {
          return <span>{_id || '-'}</span>;
        },
      },
      {
        title: 'No. of people',
        dataIndex: 'count',
        key: 'count',
        width: '20%',
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
      <Menu.Item key={TYPE.JOB_TITLE}>Job Title</Menu.Item>
      <Menu.Item key={TYPE.DIVISION}>Division</Menu.Item>
    </Menu>
  );

  const renderOption = () => {
    return (
      <Dropdown overlay={menu}>
        <div className={styles.options} onClick={(e) => e.preventDefault()}>
          <span>{renderFilterMode()}</span>
          <img src={SmallDownArrow} alt="" />
        </div>
      </Dropdown>
    );
  };

  return (
    <Card title="People" extra={renderOption()} className={styles.People}>
      <div className={styles.tableContainer}>
        <CommonTable
          columns={generateColumns()}
          loading={loadingFetch}
          list={utilizationOverviewList}
          limit={6}
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
