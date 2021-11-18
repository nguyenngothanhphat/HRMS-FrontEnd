import { DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import CommonTable from '@/pages/ProjectManagement/components/ProjectInformation/components/CommonTable';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import styles from './index.less';

const ReviewResourceTable = (props) => {
  const {
    removeResource = () => {},
    selectedResources = [],
    setSelectedResources = () => {},
  } = props;

  const onDateChange = (value, row, type) => {
    const temp = JSON.parse(JSON.stringify(selectedResources));
    const result = temp.map((v) => {
      if (v._id === row._id) {
        return {
          ...v,
          [type]: value,
        };
      }
      return v;
    });
    setSelectedResources(result);
  };

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
        render: (billingStatus) => {
          return <span>{billingStatus || '-'}</span>;
        },
      },
      {
        title: renderTimeTitle('Start Date'),
        dataIndex: 'startDate',
        key: 'startDate',
        align: 'center',
        render: (startDate, row) => {
          const value = startDate ? moment(startDate) : null;
          return (
            <DatePicker value={value} onChange={(val) => onDateChange(val, row, 'startDate')} />
          );
        },
      },
      {
        title: renderTimeTitle('End Date'),
        dataIndex: 'endDate',
        key: 'endDate',
        align: 'center',
        render: (endDate, row) => {
          const value = endDate ? moment(endDate) : null;
          return <DatePicker value={value} onChange={(val) => onDateChange(val, row, 'endDate')} />;
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
