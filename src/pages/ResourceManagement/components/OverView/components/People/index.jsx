import { Card } from 'antd';
import React from 'react';
import CommonTable from '../CommonTable';
import styles from './index.less';

const People = () => {
  const generateColumns = () => {
    const columns = [
      {
        title: 'Job Title',
        dataIndex: 'jobTitle',
        key: 'jobTitle',
        render: (jobTitle) => {
          return <span>{jobTitle || '-'}</span>;
        },
      },
      {
        title: 'No. of people',
        dataIndex: 'noOfPeople',
        key: 'noOfPeople',
        width: '20%',
        render: (noOfPeople) => {
          return <span>{noOfPeople || '-'}</span>;
        },
      },
    ];

    return columns;
  };

  const renderOption = () => {
    return <div className={styles.options}>option</div>;
  };

  return (
    <Card title="People" extra={renderOption()} className={styles.People}>
      <div className={styles.tableContainer}>
        <CommonTable columns={generateColumns()} list={[]} />
      </div>
    </Card>
  );
};

export default People;
