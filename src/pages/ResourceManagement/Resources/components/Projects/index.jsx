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
  } = props;
  const [projectStatus, setProjectStatus] = useState('All');

  const fetchProjectList = async (payload) => {
    let tempPayload = payload;
    if (projectStatus !== 'All') {
      tempPayload = {
        ...payload,
        projectStatus: [projectStatus],
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
  }, [projectStatus]);
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
      />
    </div>
  );
};

export default connect(
  ({ resourceManagement: { projectTable = [], statusProject = [] } = {}, loading }) => ({
    loadingFetchProjectList: loading.effects['resourceManagement/fetchProjectList'],
    projectTable,
    statusProject,
  }),
)(ProjectList);
