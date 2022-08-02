import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const Projects = (props) => {
  const {
    dispatch,
    loadingFetch = false,
    reId = '',
    customerProfile: {
      projectList = [],
      // filter list
      projectTypeList = [],
      projectStatusList = [],
      divisionList = [],
      employeeList = [],
      projectNameList = [],
    } = {},
  } = props;

  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState({});

  const fetchProjectList = async () => {
    dispatch({
      type: 'customerProfile/fetchProjectListEffect',
      payload: {
        customerId: [reId],
        searchKey: searchValue,
        ...filter,
      },
    });
  };

  const fetchFilterData = () => {
    if (isEmpty(projectNameList)) {
      dispatch({
        type: 'customerProfile/fetchProjectNameListEffect',
      });
    }
    if (isEmpty(projectTypeList)) {
      dispatch({
        type: 'customerProfile/fetchProjectTypeListEffect',
      });
    }
    if (isEmpty(projectStatusList)) {
      dispatch({
        type: 'customerProfile/fetchProjectStatusListEffect',
      });
    }
    if (isEmpty(divisionList)) {
      dispatch({
        type: 'customerProfile/fetchDivisionListEffect',
      });
    }
    if (isEmpty(employeeList)) {
      dispatch({
        type: 'customerProfile/fetchEmployeeListEffect',
      });
    }
  };

  useEffect(() => {
    fetchProjectList();
  }, [searchValue, JSON.stringify(filter)]);

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const onFilter = (values) => {
    setFilter(values);
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Project ID',
        dataIndex: 'projectId',
        fixed: 'left',
        width: '10%',
        render: (projectID) => {
          return <span style={{ fontWeight: '700' }}>{projectID}</span>;
        },
      },
      {
        title: 'Project Name',
        dataIndex: 'projectName',
        width: '10%',
      },
      {
        title: 'Divisions',
        dataIndex: 'division',
        width: '10%',
      },
      {
        title: 'Engagement Type',
        dataIndex: 'engagementType',
        width: '10%',
      },
      {
        title: 'Proj. Manager',
        dataIndex: 'projectManager',
        width: '10%',
        render: (projectManager) => {
          return <span>{projectManager?.generalInfo?.legalName || '-'}</span>;
        },
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  const applied = Object.values(filter).filter((v) => v).length;

  return (
    <div className={styles.Projects}>
      <div className={styles.documentHeader}>
        <div className={styles.documentHeaderTitle}>
          <span>Projects</span>
        </div>
        <div className={styles.documentHeaderFunction}>
          <FilterCountTag
            count={applied}
            onClearFilter={() => {
              onFilter({});
            }}
          />

          <FilterPopover
            placement="bottomRight"
            content={<FilterContent onFilter={onFilter} filter={filter} />}
          >
            <CustomOrangeButton onClick={fetchFilterData} showDot={applied > 0} />
          </FilterPopover>
          <CustomSearchBox placeholder="Search by Project Name" onSearch={onSearch} />
        </div>
      </div>
      <div className={styles.documentBody}>
        <CommonTable loading={loadingFetch} columns={generateColumns()} list={projectList} />
      </div>
    </div>
  );
};

export default connect(({ customerProfile, loading }) => ({
  customerProfile,
  loadingFetch: loading.effects['customerProfile/fetchProjectListEffect'],
}))(Projects);
