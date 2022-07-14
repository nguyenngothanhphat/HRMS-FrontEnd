import { Popconfirm, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import moment from 'moment';
import Parser from 'html-react-parser';
import CommonTable from '../CommonTable';
import styles from './index.less';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import EditIcon from '@/assets/homePage/editIcon.svg';
import { goToTop } from '@/utils/utils';

const ImageTable = (props) => {
  const {
    dispatch,
    data = [],
    loading = false,
    totalType = 0,
    refreshData = () => {},
    onEditPost = () => {},
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
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (description = '') => (
          <div style={{ lineHeight: '22px', whiteSpace: 'pre-line' }}>{Parser(description)}</div>
        ),
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
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
        align: 'center',
        width: '10%',
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
    <div className={styles.ImageTable}>
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
export default connect(() => ({}))(ImageTable);
