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
    listLocationsByCompany = [],
    companiesOfUser = [],
  } = props;
  return (
    <div>
      <TableComponent
        list={list}
        roleList={roleList}
        employeeList={employeeList}
        dispatch={dispatch}
        user={user}
        listLocationsByCompany={listLocationsByCompany}
        companiesOfUser={companiesOfUser}
        loading={loading}
      />
    </div>
  );
};

export default ActiveProject;
