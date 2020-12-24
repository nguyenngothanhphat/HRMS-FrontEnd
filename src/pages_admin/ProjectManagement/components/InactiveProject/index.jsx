import React from 'react';
import TableComponent from '../TableComponent';
import s from './index.less';

const InactiveProject = (props) => {
  const { list = [], roleList = [], employeeList = [] } = props;
  return (
    <div>
      <TableComponent list={list} roleList={roleList} employeeList={employeeList} />
    </div>
  );
};

export default InactiveProject;
