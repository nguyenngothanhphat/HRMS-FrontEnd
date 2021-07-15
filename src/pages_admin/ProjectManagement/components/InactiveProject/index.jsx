import React from 'react';
import TableComponent from '../TableComponent';
// import s from './index.less';

const InactiveProject = (props) => {
  const {
    list = [],
    roleList = [],
    employeeList = [],
    loadingFetchProject = false,
    getPageAndSize = () => {},
    pageSelected = '',
    size = '',
    totalInactive = '',
  } = props;
  return (
    <div>
      <TableComponent
        list={list}
        roleList={roleList}
        employeeList={employeeList}
        pageSelected={pageSelected}
        size={size}
        totalInactive={totalInactive}
        getPageAndSize={getPageAndSize}
        loadingFetchProject={loadingFetchProject}
      />
    </div>
  );
};

export default InactiveProject;
