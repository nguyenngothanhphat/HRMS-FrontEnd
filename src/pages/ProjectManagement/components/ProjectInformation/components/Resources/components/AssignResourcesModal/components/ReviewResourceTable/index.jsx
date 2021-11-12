import React from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import CommonTable from '@/pages/ProjectManagement/components/ProjectInformation/components/CommonTable';
import styles from './index.less';

const ReviewResourceTable = () => {
  const generateColumns = () => {
    const columns = [
      {
        title: 'Resource Type',
        dataIndex: 'resourceType',
        key: 'resourceType',
        render: (resourceType) => {
          return <span>{resourceType || '-'}</span>;
        },
      },
      {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        render: (division) => {
          return <span>{division || '-'}</span>;
        },
      },
      {
        title: 'Billing Status',
        dataIndex: 'billingStatus',
        key: 'billingStatus',
        render: (billingStatus) => {
          return <span>{billingStatus || '-'}</span>;
        },
      },
      {
        title: 'No. of Resources',
        dataIndex: 'noOfResources',
        key: 'noOfResources',
        render: (noOfResources) => {
          return <span>{noOfResources || '-'}</span>;
        },
      },
      {
        title: 'Comments/Notes',
        dataIndex: 'comments',
        key: 'comments',
        render: (comments) => {
          return <span>{comments || '-'}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: () => {
          return <img src={DeleteIcon} alt="" />;
        },
      },
    ];

    return columns;
  };

  return (
    <div className={styles.ReviewResourceTable}>
      <CommonTable columns={generateColumns()} list={[]} />
    </div>
  );
};
export default connect(() => ({}))(ReviewResourceTable);
