import { CloseOutlined } from '@ant-design/icons';
import { Image, Popconfirm, Tag } from 'antd';
import Parser from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import HideIcon from '@/assets/homePage/hideIconWhite.svg';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import FilterPopover from '@/components/FilterPopover';
import AnnouncementsCard from '@/pages/HomePage/components/Announcements/components/AnnouncementsCard';
import { POST_TYPE, STATUS_POST } from '@/constants/homePage';
import FilterForm from './components/FilterForm';
import ViewPostIcon from '@/assets/projectManagement/view.svg';
import styles from './index.less';

function EmployeePostManagement(props) {
  const {
    dispatch,
    announcements = [],
    loadingFetchAnnouncementList = false,
    announcementTotal = 0,
  } = props;

  const [visible, setVisible] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [viewDetailModal, setViewDetailModal] = useState(false);
  const [detailPost, setDetailPost] = useState({});
  const [activePostID, setActivePostID] = useState('');
  const [applied, setApplied] = useState(0);
  const [statusPost, setStatusPost] = useState(STATUS_POST.ACTIVE);
  const [form, setForm] = useState(null);

  const fetchData = (filter) => {
    dispatch({
      type: 'homePage/fetchAnnouncementsEffect',
      payload: {
        postType: POST_TYPE.SOCIAL,
        limit,
        page,
        ...filter,
      },
    });
  };

  const onChangePage = (pageSeleted, size) => {
    setPage(pageSeleted);
    setLimit(size || limit);
  };

  useEffect(() => {
    fetchData();
  }, [limit, page]);

  const onHidePost = (record) => {
    dispatch({
      type: 'homePage/updatePostEffect',
      payload: {
        postType: POST_TYPE.SOCIAL,
        status: STATUS_POST.HIDDEN,
        id: record?._id,
      },
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) fetchData();
      setStatusPost(STATUS_POST.HIDDEN);
    });
  };

  const onActivePost = (record) => {
    dispatch({
      type: 'homePage/updatePostEffect',
      payload: {
        postType: POST_TYPE.SOCIAL,
        status: STATUS_POST.ACTIVE,
        id: record?._id,
      },
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) fetchData();
      setStatusPost(STATUS_POST.ACTIVE);
    });
  };

  const onDeleteAttachment = (record) => {
    dispatch({
      type: 'homePage/deletePostEffect',
      payload: {
        postId: record?._id,
      },
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) fetchData();
    });
  };

  const viewDetailPost = (row) => {
    setViewDetailModal(true);
    setDetailPost(row);
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'postID',
        key: 'postID',
        width: '10%',
        render: (postId, row) => (
          <span className={styles.blueText} onClick={() => viewDetailPost(row)}>
            #{postId}
          </span>
        ),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '15%',
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
          return attachments.map((x) => (
            <Image.PreviewGroup>
              <Image width={32} height={32} src={x.url} />
            </Image.PreviewGroup>
          ));
        },
      },
      {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: '15%',
        render: (createdBy = {}) => {
          const { generalInfoInfo: { legalName = '', userId = '' } = {} } = createdBy;
          return (
            <Link style={{ fontWeight: 500 }} to={`/directory/employee-profile/${userId}`}>
              <span>{legalName}</span>
            </Link>
          );
        },
      },
      {
        title: 'Created On',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: '15%',
        render: (updatedAt = '') => {
          return <span>{updatedAt ? updatedAt?.substring(0, 10) : ''}</span>;
        },
      },
      {
        title: 'Flag as Inappropriate',
        dataIndex: 'flag',
        key: 'flag',
        width: '5%',
        align: 'center',
        render: (flag = []) => {
          return <span>{flag?.length}</span>;
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: (status = '') => {
          return <span>{status}</span>;
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
              {record?.status === STATUS_POST.ACTIVE ? (
                <Popconfirm
                  placement="left"
                  title="Are you sure?"
                  onConfirm={() => onHidePost(record)}
                >
                  <img src={HideIcon} alt="viewPostIcon" />
                </Popconfirm>
              ) : (
                <Popconfirm
                  placement="left"
                  title="Are you sure?"
                  onConfirm={() => onActivePost(record)}
                  disabled={record?.flag.length >= 5}
                >
                  <img
                    src={ViewPostIcon}
                    alt="hideIcon"
                    style={{ cursor: record?.flag.length >= 5 ? 'not-allowed' : 'pointer' }}
                  />
                </Popconfirm>
              )}

              <Popconfirm
                placement="left"
                title="Are you sure?"
                onConfirm={() => onDeleteAttachment(record)}
              >
                <img src={RemoveIcon} alt="deleteIcon" />
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  const handleClearFilter = () => {
    fetchData();
    form?.resetFields();
    setApplied(0);
  };

  return (
    <div className={styles.PostCard}>
      <div className={styles.title}>
        <div className={styles.filter}>
          {applied > 0 && (
            <Tag
              className={styles.tagCountFilter}
              closable
              closeIcon={<CloseOutlined onClick={handleClearFilter} />}
            >
              {applied} filters applied
            </Tag>
          )}
          <FilterPopover
            content={<FilterForm setForm={setForm} setApplied={setApplied} fetchData={fetchData} />}
            trigger="click"
            placement="bottomRight"
            visible={visible}
            onVisibleChange={() => setVisible(!visible)}
          >
            <CustomOrangeButton showDot={applied > 0}>Filter</CustomOrangeButton>
          </FilterPopover>
        </div>
      </div>
      <div className={styles.table}>
        <CommonTable
          columns={generateColumns()}
          list={announcements}
          loading={loadingFetchAnnouncementList}
          onChangePage={onChangePage}
          limit={limit}
          page={page}
          isBackendPaging
          total={announcementTotal}
        />
      </div>
      <CommonModal
        visible={viewDetailModal}
        onClose={() => setViewDetailModal(false)}
        content={
          <AnnouncementsCard
            item={detailPost}
            activePostID={activePostID}
            setActivePostID={setActivePostID}
            isView
          />
        }
        hasHeader={false}
        hasFooter={false}
        width={600}
      />
    </div>
  );
}

export default connect(({ homePage: { announcements = [], announcementTotal } = {}, loading }) => ({
  announcements,
  announcementTotal,
  loadingFetchAnnouncementList: loading.effects['homePage/fetchAnnouncementsEffect'],
}))(EmployeePostManagement);
