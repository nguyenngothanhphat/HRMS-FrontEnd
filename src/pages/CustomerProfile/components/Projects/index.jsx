import { debounce } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import FilterContent from './components/FilterContent';
import styles from './index.less';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterPopover from '@/components/FilterPopover';

const Projects = (props) => {
  const {
    dispatch,
    loadingFetch = false,
    reId = '',
    customerProfile: { projectList = [] } = {},
  } = props;

  const fetchProjectList = async (payload) => {
    dispatch({
      type: 'customerProfile/fetchProjectListEffect',
      payload: {
        customerId: [reId],
        ...payload,
      },
    });
  };

  useEffect(() => {
    fetchProjectList();
  }, []);

  const onSearchDebounce = debounce((value) => {
    fetchProjectList({ searchKey: value });
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
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

  return (
    <div className={styles.Projects}>
      <div className={styles.documentHeader}>
        <div className={styles.documentHeaderTitle}>
          <span>Projects</span>
        </div>
        <div className={styles.documentHeaderFunction}>
          <FilterPopover placement="bottomRight" content={<FilterContent />}>
            <CustomOrangeButton />
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
