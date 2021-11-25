import { Card } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import CommonTable from '../CommonTable';
import FilterButton from '../FilterButton';
import FilterPopover from '../FilterPopover';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const NewJoinees = (props) => {
  const { dispatch, loadingFetch = false, resourceManagement: { newJoineeList = [] } = {} } = props;

  const fetchData = () => {
    dispatch({
      type: 'resourceManagement/fetchNewJoineeList',
      // payload: {
      //   searchName: keySearch,
      //   ...filter,
      // },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateColumns = () => {
    const columns = [
      {
        title: 'Candidate ID',
        dataIndex: 'candidate',
        key: 'candidate',
        render: (candidate) => {
          return <span>{candidate || '-'}</span>;
        },
      },
      {
        title: 'Name',
        dataIndex: 'employee',
        key: 'employee',
        width: '20%',
        render: ({ firstName = '', middleName = '', lastName = '' } = {}) => {
          let fullName = firstName;
          if (middleName) fullName += ` ${middleName}`;
          if (lastName) fullName += ` ${lastName}`;

          return <div>{fullName}</div>;
        },
      },
      {
        title: 'Job Title',
        dataIndex: 'title',
        key: 'title',
        width: 200,
        render: ({ name } = {}) => <div>{name}</div>,
      },
      {
        title: 'Joining Date',
        dataIndex: 'joiningDate',
        key: 'joiningDate',
        width: 200,
        render: (joiningDate) => (
          <span>{moment(joiningDate).locale('en').format('MM/DD/YYYY')}</span>
        ),
      },
    ];

    return columns;
  };

  const renderOption = () => {
    return (
      <div className={styles.options}>
        <FilterPopover content={<FilterContent />}>
          <FilterButton />
        </FilterPopover>
      </div>
    );
  };

  return (
    <Card title="New Joinees" extra={renderOption()} className={styles.NewJoinees}>
      <div className={styles.tableContainer}>
        <CommonTable columns={generateColumns()} list={newJoineeList} loading={loadingFetch} />
      </div>
    </Card>
  );
};

export default connect(({ resourceManagement, loading }) => ({
  resourceManagement,
  loadingFetch: loading.effects['resourceManagement/fetchNewJoineeList'],
}))(NewJoinees);
