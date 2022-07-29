import { Button, Col, Dropdown, Menu, Row, Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import LazyLoad from 'react-lazyload';
import { connect } from 'umi';
import EditIcon from '@/assets/edit-customField.svg';
import ShowMoreIcon from '@/assets/homePage/downArrow.svg';
import MenuIcon from '@/assets/offboarding/menuIcon.png';
import CommonModal from '@/components/CommonModal';
import EmptyComponent from '@/components/Empty';
import { getCurrentLocation } from '@/utils/authority';
import { POST_TYPE } from '@/utils/homePage';
import { getCompanyName } from '@/utils/utils';
import AddPostContent from './components/AddPostContent';
import EmployeeTag from './components/EmployeeTag';
import LikeComment from './components/LikeComment';
import PostContent from './components/PostContent';
import FlagIcon from '@/assets/homePage/flagIcon.svg';
import HideIcon from '@/assets/homePage/hideIcon.svg';
import DeleteIcon from '@/assets/relievingDel.svg';
import UpdateIcon from '@/assets/editMailExit.svg';
import styles from './index.less';

const Announcements = (props) => {
  const { dispatch, loadingFetchAnnouncementList = false } = props;

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
  const [form, setForm] = useState(null);

  const fetchData = (postType, limit = 5, location = '') => {
    const payload = {
      postType,
      page: 1,
      limit,
    };
    if (location) {
      payload.location = location ? [location] : [];
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
    });
  };

  const hiddenPost = (postId = '') => {
    return dispatch({
      type: 'homePage/updatePostEffect',
      payload: {
        id: postId,
        postType: POST_TYPE.SOCIAL,
        status: 'HIDDEN',
      },
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
      fetchData(POST_TYPE.SOCIAL, limitSocial);
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
          <Menu.Item onClick={() => setIsVisible(true)}>
            <img className={styles.actionIcon} src={UpdateIcon} alt="updateIcon" />
            <span>Edit your post</span>
          </Menu.Item>
          <Menu.Item>
            <img className={styles.actionIcon} src={DeleteIcon} alt="deleteIcon" />
            <span>Delete your post</span>
          </Menu.Item>
        </Menu>
      );
    } else if (viewSettingHomePage === 1) {
      menu = (
        <Menu>
          <Menu.Item onClick={() => hiddenPost(data?._id)}>
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
          <LazyLoad key={x._id} height={200} offset={[-100, 0]}>
            <Col span={24}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <EmployeeTag employee={x.createdBy} createDate={x.createdAt} />
                  {isSocial && (
                    <Dropdown
                      className={styles.menuIcon}
                      overlay={actionMenu(x)}
                      placement="bottomRight"
                      trigger="click"
                    >
                      <img style={{ padding: 24 }} src={MenuIcon} alt="menu-icon" />
                    </Dropdown>
                  )}
                </div>
                <PostContent post={x} />
                <LikeComment
                  post={x}
                  activePostID={activePostID}
                  setActivePostID={setActivePostID}
                />
              </div>
            </Col>
          </LazyLoad>
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

  const renderCompanyUI = () => {
    if (!loadingFetchAnnouncementList && announcements.length === 0) {
      return (
        <div className={styles.card}>
          <EmptyComponent description="No Announcements" />
        </div>
      );
    }
    return <>{announcements.length > 0 ? spinWrap(renderData()) : skeletonWrap(renderData())}</>;
  };

  const renderSocialUI = () => {
    if (!loadingFetchAnnouncementList && announcements.length === 0) {
      return (
        <div className={styles.card}>
          <EmptyComponent description="No Announcements" />
        </div>
      );
    }
    return <>{announcements.length > 0 ? spinWrap(renderData()) : skeletonWrap(renderData())}</>;
  };

  const handleCompanyClick = () => {
    setIsSocial(false);
    fetchData(POST_TYPE.COMPANY, limitCompany, getCurrentLocation());
  };

  const handleSocialClick = () => {
    setIsSocial(true);
    fetchData(POST_TYPE.SOCIAL, limitSocial);
  };

  // RENDER UI
  return (
    <div className={styles.Announcements}>
      <div className={styles.title}>
        <div className={styles.head}>
          <p className={styles.text}>Announcements</p>
          <div className={styles.button}>
            <Button
              className={!isSocial ? styles.active : ''}
              style={{ display: 'inline-block', marginRight: 5 }}
              onClick={handleCompanyClick}
            >
              {getCompanyName()}
            </Button>
            <Button className={isSocial ? styles.active : ''} onClick={handleSocialClick}>
              Social
            </Button>
          </div>
        </div>
        {isSocial && (
          <div className={styles.sharePost}>
            <p className={styles.sharePost__content} onClick={() => setIsVisible(true)}>
              <img src={EditIcon} alt="editIcon" style={{ paddingRight: 10 }} />
              <span> Hi {name}, let share something today!</span>
            </p>
          </div>
        )}
      </div>
      {isSocial ? renderSocialUI() : renderCompanyUI()}
      <CommonModal
        visible={isVisible}
        title="New Post"
        onClose={() => setIsVisible(false)}
        content={
          <AddPostContent
            setForm={setForm}
            fetchData={fetchData}
            limit={limitSocial}
            setIsVisible={setIsVisible}
          />
        }
        secondText="Reset"
        firstText="Post"
        hasCancelButton={false}
        hasSecondButton
        onSecondButtonClick={() => form.resetFields()}
      />
    </div>
  );
};

export default connect(({ homePage, loading, user }) => ({
  homePage,
  user,
  loadingFetchAnnouncementList: loading.effects['homePage/fetchAnnouncementsEffect'],
}))(Announcements);
