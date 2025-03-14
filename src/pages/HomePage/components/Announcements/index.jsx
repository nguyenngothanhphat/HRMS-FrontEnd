import { Button, Col, Row, Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ErrorFile from '@/assets/adminSetting/errorFile.svg';
import ShowMoreIcon from '@/assets/homePage/downArrow.svg';
import CommonModal from '@/components/CommonModal';
import EmptyComponent from '@/components/Empty';
import { POST_TYPE, STATUS_POST } from '@/constants/homePage';
import { getCurrentLocation } from '@/utils/authority';
import AddPostContent from './components/AddPostContent';
import PostCard from './components/PostCard';
import ModeSwitcher from './components/ModeSwitcher';
import styles from './index.less';
import { getSocialMode, setSocialMode } from '@/utils/homePage';

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
  const { homePage: { announcements = [], announcementTotal = 0 } = {} } = props;

  const [activePostID, setActivePostID] = useState('');
  const [limitCompany, setLimitCompany] = useState(5);
  const [limitSocial, setLimitSocial] = useState(5);
  const [isSocial, setIsSocial] = useState(getSocialMode());
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

  useEffect(() => {
    setSocialMode(isSocial);
  }, [isSocial]);

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

  const renderData = () => {
    return (
      <Row gutter={[24, 24]} style={{ minHeight: 300 }}>
        {announcements.map((x) => (
          <PostCard
            item={x}
            isSocial={isSocial}
            activePostID={activePostID}
            setActivePostID={setActivePostID}
            fetchData={fetchData}
            setRecord={setRecord}
            limitSocial={limitSocial}
            setIsVisible={setIsVisible}
            setIsEdit={setIsEdit}
            setIsDelete={setIsDelete}
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

  // RENDER UI
  return (
    <div className={styles.Announcements}>
      <ModeSwitcher
        fetchData={fetchData}
        setIsVisible={setIsVisible}
        isSocial={isSocial}
        setIsSocial={setIsSocial}
        limitSocial={limitSocial}
        limitCompany={limitCompany}
      />
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
          <div className={styles.hiddenModalContent}>
            <img src={ErrorFile} alt="errorFile" />
            <p>Are you sure you want to delete this post?</p>
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
