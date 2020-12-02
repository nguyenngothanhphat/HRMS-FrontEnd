import React from 'react';
import TableComponent from '../TableComponent';
import s from './index.less';

const InactiveProject = (props) => {
  const { list = [], columns = [] } = props;

  return (
    <div>
      <TableComponent list={list} columns={columns} />
    </div>
  );
};

export default InactiveProject;
