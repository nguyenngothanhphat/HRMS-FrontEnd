import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import CommonTable from '@/pages/ProjectManagement/components/ProjectInformation/components/CommonTable';
import { DATE_FORMAT_LIST } from '@/utils/projectManagement';
import styles from './index.less';

const ReviewResourceTable = (props) => {
  const {
    removeResource = () => {},
    selectedResources = [],
    billingStatus = '',
    startDate = '',
    endDate = '',
  } = props;

  const renderTimeTitle = (title) => {
    return (
      <span className={styles.timeTitle}>
        <span>{title}</span>
        <span className={styles.smallText}>(mm/dd/yyyy)</span>
      </span>
    );
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        render: (generalInfo = {}) => {
          const { legalName = '' } = generalInfo;
          return <span>{legalName}</span>;
        },
      },
      {
        title: 'Designation',
        dataIndex: 'titleInfo',
        key: 'titleInfo',
        render: (titleInfo) => {
          return (
            <div className={styles.cell}>
              <span>{titleInfo.name}</span>
            </div>
          );
        },
      },
      {
        title: 'Billing Status',
        dataIndex: 'billingStatus',
        key: 'billingStatus',
        render: () => {
          return <span>{billingStatus || '-'}</span>;
        },
      },
      {
        title: renderTimeTitle('Start Date'),
        dataIndex: 'startDate',
        key: 'startDate',
        align: 'center',
        render: () => {
          const value = startDate ? moment(startDate).format(DATE_FORMAT_LIST) : null;
          return <span>{value || '-'}</span>;
        },
      },
      {
        title: renderTimeTitle('End Date'),
        dataIndex: 'endDate',
        key: 'endDate',
        align: 'center',
        render: () => {
          const value = endDate ? moment(endDate).format(DATE_FORMAT_LIST) : null;
          return <span>{value || '-'}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, row) => {
          return (
            <img
              src={DeleteIcon}
              style={{ cursor: 'pointer' }}
              alt=""
              onClick={() => removeResource(row?._id)}
            />
          );
        },
      },
    ];

    return columns;
  };

  return (
    <div className={styles.ReviewResourceTable}>
      <CommonTable columns={generateColumns()} list={selectedResources} showPagination={false} />
    </div>
  );
};
export default connect(() => ({}))(ReviewResourceTable);
