import { Popconfirm, Image } from 'antd';
import React from 'react';
import { connect, Link } from 'umi';
import moment from 'moment';
import Parser from 'html-react-parser';
import CommonTable from '../CommonTable';
import styles from './index.less';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import EditIcon from '@/assets/homePage/editIcon.svg';

const AnnouncementTable = (props) => {
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
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (description = '') => (
          <div style={{ lineHeight: '22px' }}>{Parser(description)}</div>
        ),
      },
      {
        title: 'Media',
        dataIndex: 'attachments',
        key: 'attachments',
        width: '10%',
        render: (attachments = []) => {
          return (
            <Image.PreviewGroup>
              {attachments.map((x) => {
                return <Image width={32} height={32} src={x.url} />;
              })}
            </Image.PreviewGroup>
          );
        },
      },
      {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: '15%',
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
        width: '10%',
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
              <Popconfirm
                placement="left"
                title="Are you sure?"
                onConfirm={() => onDeleteAttachment(record)}
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
    <div className={styles.AnnouncementTable}>
      <CommonTable list={data} loading={loading} columns={getColumns()} />
    </div>
  );
};
export default connect(() => ({}))(AnnouncementTable);
