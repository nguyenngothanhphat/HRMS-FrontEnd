import { Popconfirm } from 'antd';
import React from 'react';
import { connect, Link } from 'umi';
import moment from 'moment';
import CommonTable from '../CommonTable';
import styles from './index.less';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import EditIcon from '@/assets/homePage/editIcon.svg';

const ImageTable = (props) => {
  const { dispatch, data = [], loading = false, refreshData = () => {} } = props;

  const onDeleteAttachment = async (record) => {
    if (record?._id) {
      const res = await dispatch({
        type: 'homePage/deletePostEffect',
        payload: {
          postId: record?._id,
        },
      });
      if (res.statusCode === 200) {
        refreshData();
      }
    }
  };

  const getColumns = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'postID',
        key: 'postID',
        render: (postID) => <span className={styles.blueText}>#{postID}</span>,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Media',
        dataIndex: 'media',
        key: 'media',
      },
      {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (createdBy = {}) => {
          return (
            <Link
              style={{ fontWeight: 500 }}
              to={`/directory/employee-profile/${createdBy?.generalInfoInfo?.userId}`}
            >
              {createdBy?.generalInfoInfo?.legalName || ''}
            </Link>
          );
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
              <img src={EditIcon} alt="" />
              <Popconfirm title="Are you sure?" onConfirm={() => onDeleteAttachment(record)}>
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
    <div className={styles.ImageTable}>
      <CommonTable list={data} loading={loading} columns={getColumns()} />
    </div>
  );
};
export default connect(() => ({}))(ImageTable);
