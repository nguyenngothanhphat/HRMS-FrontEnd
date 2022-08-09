import { Button, Col, Menu, Row, Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ErrorFile from '@/assets/adminSetting/errorFile.svg';
import EditIcon from '@/assets/edit-customField.svg';
import UpdateIcon from '@/assets/editMailExit.svg';
import ShowMoreIcon from '@/assets/homePage/downArrow.svg';
import FlagIcon from '@/assets/homePage/flagIcon.svg';
import HideIcon from '@/assets/homePage/hideIcon.svg';
import DeleteIcon from '@/assets/relievingDel.svg';
import CommonModal from '@/components/CommonModal';
import EmptyComponent from '@/components/Empty';
import { getCurrentLocation } from '@/utils/authority';
import { POST_TYPE, STATUS_POST } from '@/constants/homePage';
import { getCompanyName } from '@/utils/utils';
import AddPostContent from './components/AddPostContent';
import AnnouncementsCard from './components/AnnouncementsCard';
import styles from './index.less';

const Announcements = (props) => {
  const {
    dispatch,
    loadingFetchAnnouncementList = false,
    loadingAddPost = false,
    loadingEditPost = false,
    loadingUploadFile = false,
    loadingDeletePost = false,
  } = props;

  // redux
  const {
    homePage: { announcements = [], announcementTotal = 0 } = {},
    user: {
      currentUser: { name = '', employee: { _id: employeeId = '' } = {} } = {},
      permissions: { viewSettingHomePage = -1 } = {},
    } = {},
  } = props;

  const [activePostID, setActivePostID] = useState('');
  const [limitCompany, setLimitCompany] = useState(5);
  const [limitSocial, setLimitSocial] = useState(5);
  const [isSocial, setIsSocial] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState(null);
  const [isUploadFile, setIsUploadFile] = useState(false);

  const fetchData = (postType, limit = 5, location = '', status = '') => {
    const payload = {
      postType,
      page: 1,
      limit,
    };
    if (location) {
      payload.location = location ? [location] : [];
    }
    if (status) {
      payload.status = STATUS_POST.ACTIVE;
    }
    return dispatch({
      type: 'homePage/fetchAnnouncementsEffect',
      payload,
    });
  };

  const flagPost = (postId = '') => {
    return dispatch({
      type: 'homePage/flagPostEffect',
      payload: {
        post: postId,
        postType: POST_TYPE.SOCIAL,
      },
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        fetchData(POST_TYPE.SOCIAL, limitSocial, '', STATUS_POST.ACTIVE);
      }
    });
  };

  const hiddenPost = (postId = '') => {
    return dispatch({
      type: 'homePage/updatePostEffect',
      payload: {
        id: postId,
        postType: POST_TYPE.SOCIAL,
        status: STATUS_POST.HIDDEN,
      },
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        fetchData(POST_TYPE.SOCIAL, limitSocial, '', STATUS_POST.ACTIVE);
      }
    });
  };

  const deletePost = (postId) => {
    return dispatch({
      type: 'homePage/deletePostEffect',
      payload: {
        postId,
      },
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        setIsDelete(false);
        fetchData(POST_TYPE.SOCIAL, limitSocial, '', STATUS_POST.ACTIVE);
      }
    });
  };

  const onClickShowMore = () => {
    if (isSocial) {
      setLimitSocial(limitSocial + 5);
    } else {
      setLimitCompany(limitCompany + 5);
    }
  };

  useEffect(() => {
    if (isSocial) {
      fetchData(POST_TYPE.SOCIAL, limitSocial, '', STATUS_POST.ACTIVE);
    }
  }, [limitSocial]);

  useEffect(() => {
    if (!isSocial) {
      fetchData(POST_TYPE.COMPANY, limitCompany, getCurrentLocation());
    }
  }, [limitCompany]);

  useEffect(() => {
    return () => {
      setIsSocial(false);
      setLimitCompany(limitCompany);
      setLimitSocial(limitSocial);
    };
  }, []);

  const renderShowMoreBtn = () => {
    const showMore = announcements.length < announcementTotal;
    if (!showMore) return null;
    return (
      <Col span={24}>
        <div className={styles.loadMore}>
          <Button onClick={onClickShowMore}>
            Show more
            <img src={ShowMoreIcon} alt="" />
          </Button>
        </div>
      </Col>
    );
  };

  const actionMenu = (data) => {
    let menu = '';
    if (data?.createdBy?._id === employeeId) {
      menu = (
        <Menu>
          <Menu.Item
            onClick={() => {
              setIsVisible(true);
              setIsEdit(true);
              setRecord(data);
            }}
          >
            <img className={styles.actionIcon} src={UpdateIcon} alt="updateIcon" />
            <span>Edit your post</span>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setIsDelete(true);
              setRecord(data);
            }}
          >
            <img className={styles.actionIcon} src={DeleteIcon} alt="deleteIcon" />
            <span>Delete your post</span>
          </Menu.Item>
        </Menu>
      );
    } else if (viewSettingHomePage === 1) {
      menu = (
        <Menu>
          <Menu.Item
            onClick={() => {
              hiddenPost(data._id);
            }}
          >
            <img className={styles.actionIcon} src={HideIcon} alt="hideIcon" />
            <span>Hide this post</span>
          </Menu.Item>
        </Menu>
      );
    } else if (!data?.flag?.includes(employeeId)) {
      menu = (
        <Menu>
          <Menu.Item onClick={() => flagPost(data?._id)}>
            <img className={styles.actionIcon} src={FlagIcon} alt="flagIcon" />
            <span>Flag as inappropriate</span>
          </Menu.Item>
        </Menu>
      );
    }

    return menu;
  };

  const renderData = () => {
    return (
      <Row gutter={[24, 24]} style={{ minHeight: 300 }}>
        {announcements.map((x) => (
          <AnnouncementsCard
            item={x}
            isSocial={isSocial}
            actionMenu={actionMenu}
            activePostID={activePostID}
            setActivePostID={setActivePostID}
          />
        ))}
        {renderShowMoreBtn()}
      </Row>
    );
  };

  const skeletonWrap = (children) => {
    return (
      <Skeleton active loading={loadingFetchAnnouncementList}>
        {children}
      </Skeleton>
    );
  };

  const spinWrap = (children) => {
    return <Spin spinning={loadingFetchAnnouncementList}>{children}</Spin>;
  };

  const handleCompanyClick = () => {
    setIsSocial(false);
    fetchData(POST_TYPE.COMPANY, limitCompany, getCurrentLocation());
  };

  const handleSocialClick = () => {
    setIsSocial(true);
    fetchData(POST_TYPE.SOCIAL, limitSocial, '', STATUS_POST.ACTIVE);
  };

  // RENDER UI
  return (
    <div className={styles.Announcements}>
      <div className={styles.title}>
        <div className={styles.head}>
          <p className={styles.text}>Announcements</p>
          <div style={{ position: 'relative' }} className={styles.button}>
            <Button
              className={!isSocial ? styles.buttonTabs : ''}
              disabled={!isSocial}
              onClick={handleCompanyClick}
            >
              {getCompanyName()}
            </Button>
            <Button
              style={{
                marginLeft: 5,
              }}
              className={isSocial ? styles.buttonTabs : ''}
              onClick={handleSocialClick}
              disabled={isSocial}
            >
              Social
            </Button>
            <div
              className={
                !isSocial
                  ? `${styles.active} ${styles.active2}`
                  : `${styles.active} ${styles.active1}`
              }
            />
          </div>
        </div>
        {isSocial && (
          <div className={styles.sharePost}>
            <p
              className={styles.sharePost__content}
              onClick={() => {
                setIsVisible(true);
              }}
            >
              <img src={EditIcon} alt="editIcon" style={{ paddingRight: 10 }} />
              <span> Hi {name}, let share something today!</span>
            </p>
          </div>
        )}
      </div>
      {/* {isSocial ? renderSocialUI() : renderCompanyUI()} */}
      {!loadingFetchAnnouncementList && announcements.length === 0 ? (
        <div className={styles.card}>
          <EmptyComponent description="No Announcements" />
        </div>
      ) : (
        <>{announcements.length > 0 ? spinWrap(renderData()) : skeletonWrap(renderData())}</>
      )}
      <CommonModal
        visible={isVisible}
        title={isEdit ? 'Edit Post' : 'New Post'}
        onClose={() => {
          setIsVisible(false);
          setIsEdit(false);
        }}
        content={
          <AddPostContent
            setForm={setForm}
            fetchData={fetchData}
            limit={limitSocial}
            setIsVisible={setIsVisible}
            isEdit={isEdit}
            record={record}
            setIsEdit={setIsEdit}
            setIsUploadFile={setIsUploadFile}
          />
        }
        secondText="Reset"
        firstText={isEdit ? 'Update' : 'Post'}
        hasCancelButton={false}
        hasSecondButton
        disabledButton={
          (isEdit ? loadingEditPost : loadingAddPost) || loadingUploadFile || isUploadFile
        }
        onSecondButtonClick={() => form.resetFields()}
        loading={(isEdit ? loadingEditPost : loadingAddPost) || loadingUploadFile || isUploadFile}
      />
      <CommonModal
        visible={isDelete}
        onClose={() => setIsDelete(false)}
        content={
          <div className={styles.hidenModalContent}>
            <img src={ErrorFile} alt="errorFile" />
            <p>Are you sure you want to delete for this post.</p>
          </div>
        }
        hasHeader={false}
        firstText="Yes"
        onFinish={() => deletePost(record?._id)}
        width={400}
        disabledButton={loadingDeletePost}
      />
    </div>
  );
};

export default connect(({ homePage, loading, user }) => ({
  homePage,
  user,
  loadingFetchAnnouncementList: loading.effects['homePage/fetchAnnouncementsEffect'],
  loadingAddPost: loading.effects['homePage/addPostEffect'],
  loadingEditPost: loading.effects['homePage/updatePostEffect'],
  loadingDeletePost: loading.effects['homePage/deletePostEffect'],
  loadingUploadFile: loading.effects['upload/addAttachment'],
}))(Announcements);
