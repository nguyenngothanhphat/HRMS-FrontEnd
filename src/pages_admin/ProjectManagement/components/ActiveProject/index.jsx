import React from 'react';

import TableComponent from '../TableComponent';
// import s from './index.less';

const ActiveProject = (props) => {
  const {
    list = [],
    roleList = [],
    employeeList = [],
    dispatch,
    user,
    loading,
    companyLocationList = [],
    companiesOfUser = [],
    loadingFetchProject = false,
    getPageAndSize = () => {},
    pageSelected = '',
    size = '',
    totalActive = '',
  } = props;
  return (
    <div>
      <TableComponent
        list={list}
        roleList={roleList}
        employeeList={employeeList}
        dispatch={dispatch}
        user={user}
        pageSelected={pageSelected}
        size={size}
        totalActive={totalActive}
        companyLocationList={companyLocationList}
        getPageAndSize={getPageAndSize}
        companiesOfUser={companiesOfUser}
        loading={loading}
        loadingFetchProject={loadingFetchProject}
      />
    </div>
  );
};

export default ActiveProject;
