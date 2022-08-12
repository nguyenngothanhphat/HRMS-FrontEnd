import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import HeaderProject from './components/HeaderProject';
import TableProject from './components/TableProject';
import styles from './index.less';

const ProjectList = (props) => {
  const {
    projectTable = [],
    statusProject = [],
    dispatch,
    loadingFetchProjectList = false,
    permissions = {},
    selectedLocations = [],
    selectedDivisions = [],
  } = props;

  // permissions
  const modifyResourcePermission = permissions.modifyResource !== -1;

  const [projectStatus, setProjectStatus] = useState('All');
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState({});

  const fetchProjectList = async () => {
    let tempPayload = {
      ...filter,
      searchKey: searchValue,
      location: selectedLocations,
      division: selectedDivisions,
    };

    if (projectStatus !== 'All') {
      tempPayload = {
        ...filter,
        searchKey: searchValue,
        projectStatus: [projectStatus],
        location: selectedLocations,
        division: selectedDivisions,
      };
    }
    dispatch({
      type: 'resourceManagement/fetchProjectList',
      payload: tempPayload,
    });
  };

  useEffect(() => {
    if (projectStatus !== 'All') {
      fetchProjectList({ projectStatus: [projectStatus] });
    } else fetchProjectList();
  }, [
    JSON.stringify(filter),
    searchValue,
    projectStatus,
    JSON.stringify(selectedLocations),
    JSON.stringify(selectedDivisions),
  ]);

  return (
    <div className={styles.ProjectList}>
      <div className={styles.tabMenu}>
        <HeaderProject
          data={statusProject}
          setProjectStatus={setProjectStatus}
          fetchProjectList={fetchProjectList}
          setSearchValue={setSearchValue}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
      <TableProject
        data={projectTable}
        loading={loadingFetchProjectList}
        fetchProjectList={fetchProjectList}
        allowModify={modifyResourcePermission}
      />
    </div>
  );
};

export default connect(
  ({
    user: { permissions },
    resourceManagement: {
      projectTable = [],
      statusProject = [],
      selectedDivisions = [],
      selectedLocations = [],
    } = {},
    loading,
  }) => ({
    loadingFetchProjectList: loading.effects['resourceManagement/fetchProjectList'],
    projectTable,
    statusProject,
    permissions,
    selectedDivisions,
    selectedLocations,
  }),
)(ProjectList);
