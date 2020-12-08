import React from 'react';

import TableComponent from '../TableComponent';
import s from './index.less';

const ActiveProject = (props) => {
  const { list = [] } = props;
  return (
    <div>
      <TableComponent list={list} />
    </div>
  );
};

export default ActiveProject;
