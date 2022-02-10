import { Popconfirm } from 'antd';
import React from 'react';
import { connect, Link } from 'umi';
import moment from 'moment';
import CommonTable from '../CommonTable';
import styles from './index.less';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import EditIcon from '@/assets/homePage/editIcon.svg';

const BannerTable = (props) => {
  const {
    dispatch,
    data = [],
    loading = false,
    refreshData = () => {},
    onEditPost = () => {},
  } = props;

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
        width: '15%',
        render: (postID) => <span className={styles.blueText}>#{postID}</span>,
      },
      {
        title: 'Media',
        dataIndex: 'media',
        key: 'media',
        width: '10%',
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
        width: '10%',
        align: 'center',
        render: (_, record) => {
          return (
            <div className={styles.actions}>
              <img src={EditIcon} alt="" onClick={() => onEditPost(record)} />
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
    <div className={styles.BannerTable}>
      <CommonTable list={data} loading={loading} columns={getColumns()} />
    </div>
  );
};
export default connect(() => ({}))(BannerTable);
