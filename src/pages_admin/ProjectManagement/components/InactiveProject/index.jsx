import React from 'react';
import TableComponent from '../TableComponent';
import s from './index.less';

const InactiveProject = (props) => {
  const { list = [], roleList = [], employeeList = [], loadingFetchProject = false } = props;
  return (
    <div>
      <TableComponent
        list={list}
        roleList={roleList}
        employeeList={employeeList}
        loadingFetchProject={loadingFetchProject}
      />
    </div>
  );
};

export default InactiveProject;
