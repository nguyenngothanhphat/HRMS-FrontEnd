import { Image, Popconfirm } from 'antd';
import Parser from 'html-react-parser';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import EditIcon from '@/assets/homePage/editIcon.svg';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { hashtagify, urlify } from '@/utils/homePage';
import { goToTop } from '@/utils/utils';
import CommonTable from '../CommonTable';
import styles from './index.less';

const AnnouncementTable = (props) => {
  const {
    dispatch,
    data = [],
    loading = false,
    refreshData = () => {},
    onEditPost = () => {},
    totalType = 0,
  } = props;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageChanged, setPageChanged] = useState(false);

  useEffect(() => {
    if (pageChanged) {
      refreshData({ page, limit });
      goToTop();
    }
  }, [page, limit]);

  const onDeleteAttachment = async (record) => {
    if (record?._id) {
      const res = await dispatch({
        type: 'homePage/deletePostEffect',
        payload: {
          postId: record?._id,
        },
      });
      if (res.statusCode === 200) {
        refreshData({ page, limit });
      }
    }
  };

  const renderContent = (text) => {
    const temp = urlify(text);
    return hashtagify(temp);
  };

  const getColumns = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'postID',
        key: 'postID',
        width: '10%',
        render: (postID) => <span className={styles.blueText}>#{postID}</span>,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (description = '') => (
          <div style={{ lineHeight: '22px', whiteSpace: 'pre-line' }}>
            {Parser(renderContent(description))}
          </div>
        ),
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        width: '16%',
        render: (location = []) => (
          <div style={{ lineHeight: '22px' }}>
            {location.map((x, index) => {
              return (
                <span key={x._id}>
                  {x.name}
                  {index + 1 < location.length ? ', ' : ''}
                </span>
              );
            })}
          </div>
        ),
      },
      {
        title: 'Media',
        dataIndex: 'attachments',
        key: 'attachments',
        width: '10%',
        render: (attachments = []) => {
          return (
            <div className={styles.media}>
              <Image.PreviewGroup>
                {attachments.slice(0, 3).map((x) => {
                  return <Image width={32} height={32} src={x.url} key={x._id || x.id} />;
                })}
              </Image.PreviewGroup>
              {attachments.length > 3 && (
                <span style={{ fontWeight: 500 }}>+{attachments.length - 3} more</span>
              )}
            </div>
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
          return <span>{createdAt ? moment(createdAt).format(DATE_FORMAT_MDY) : ''}</span>;
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

  const onChangePage = (p, l) => {
    setPageChanged(true);
    setPage(p);
    setLimit(l || limit);
  };

  return (
    <div className={styles.AnnouncementTable}>
      <CommonTable
        list={data}
        loading={loading}
        columns={getColumns()}
        total={totalType}
        isBackendPaging
        onChangePage={onChangePage}
        page={page}
        limit={limit}
      />
    </div>
  );
};
export default connect(() => ({}))(AnnouncementTable);
