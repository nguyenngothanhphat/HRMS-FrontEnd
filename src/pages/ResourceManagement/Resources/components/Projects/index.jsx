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

  const fetchProjectList = async (payload) => {
    let tempPayload = payload;
    if (projectStatus !== 'All') {
      tempPayload = {
        ...payload,
        projectStatus: [projectStatus],
        location: selectedLocations,
        division: selectedDivisions,
      };
    }
    dispatch({
      type: 'resourceManagement/fetchProjectList',
      payload: tempPayload,
    });
    dispatch({
      type: 'resourceManagement/fetchStatusProjectList',
    });
  };

  useEffect(() => {
    if (projectStatus !== 'All') {
      fetchProjectList({ projectStatus: [projectStatus] });
    } else fetchProjectList();
  }, [projectStatus, selectedLocations, selectedDivisions]);
  return (
    <div className={styles.ProjectList}>
      <div className={styles.tabMenu}>
        <HeaderProject
          data={statusProject}
          setProjectStatus={setProjectStatus}
          fetchProjectList={fetchProjectList}
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
