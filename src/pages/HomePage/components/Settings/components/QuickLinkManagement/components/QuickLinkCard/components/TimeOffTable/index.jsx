import { Popconfirm } from 'antd';
import Parser from 'html-react-parser';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, Link } from 'umi';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import EditIcon from '@/assets/homePage/editIcon.svg';
import CommonTable from '../CommonTable';
import styles from './index.less';

const TimeOffTable = (props) => {
  const {
    dispatch,
    data = [],
    loading = false,
    refreshData = () => {},
    onEditQuickLink = () => {},
    totalQuickLink = {},
    selectedTab = '',
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const onDeleteQuickLink = async (record) => {
    if (record?._id) {
      const res = await dispatch({
        type: 'homePage/deleteQuickLinkEffect',
        payload: {
          id: record?._id,
        },
      });
      if (res.statusCode === 200) {
        refreshData(currentPage, pageSize);
      }
    }
  };

  const getColumns = () => {
    const columns = [
      {
        title: 'Id',
        dataIndex: 'linkId',
        key: 'linkId',
        render: (linkId) => <span className={styles.blueText}>#{linkId}</span>,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '20%',
        render: (description = '') => (
          <div style={{ lineHeight: '22px' }}>{Parser(description)}</div>
        ),
      },
      {
        title: 'Location',
        dataIndex: 'locationInfo',
        key: 'locationInfo',
        width: '10%',
        render: (locations) => (
          <div style={{ lineHeight: '22px' }}>
            {locations.map((x, index) => {
              return (
                <span key={x._id}>
                  {x.name}
                  {index + 1 < locations.length ? ', ' : ''}
                </span>
              );
            })}
          </div>
        ),
      },
      {
        title: 'File',
        dataIndex: 'attachmentInfo',
        key: 'attachmentInfo',
        render: (attachments = []) => {
          return attachments.map((x) => <div>{x.name}</div>);
        },
      },
      {
        title: 'Created By',
        dataIndex: 'employeeInfo',
        key: 'employeeInfo',
        render: (employees = {}) => {
          return employees.map((employee) => (
            <Link
              style={{ fontWeight: 500 }}
              to={`/directory/employee-profile/${employee?.userId}`}
            >
              {employee?.legalName || ''}
            </Link>
          ));
        },
      },
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt = {}) => {
          return <span>{createdAt ? moment(createdAt).format('MM/DD/YYYY') : ''}</span>;
        },
      },

      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, record) => {
          return (
            <div className={styles.actions}>
              <img src={EditIcon} alt="" onClick={() => onEditQuickLink(record)} />
              <Popconfirm
                placement="left"
                title="Are you sure?"
                onConfirm={() => onDeleteQuickLink(record)}
              >
                <img src={RemoveIcon} alt="" />
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  return (
    <div className={styles.TimeOffTable}>
      <CommonTable
        list={data}
        columns={getColumns()}
        selectedTab={selectedTab}
        refreshData={refreshData}
        totalQuickLink={totalQuickLink}
        loading={loading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
export default connect(() => ({}))(TimeOffTable);
