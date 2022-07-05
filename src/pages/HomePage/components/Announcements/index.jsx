import { Button, Col, Row, Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import LazyLoad from 'react-lazyload';
import { connect } from 'umi';
import ShowMoreIcon from '@/assets/homePage/downArrow.svg';
import EmptyComponent from '@/components/Empty';
import { getCurrentLocation } from '@/utils/authority';
import { TAB_IDS } from '@/utils/homePage';
import EmployeeTag from './components/EmployeeTag';
import LikeComment from './components/LikeComment';
import PostContent from './components/PostContent';
import styles from './index.less';

const Announcements = (props) => {
  const { dispatch, loadingFetchAnnouncementList = false } = props;

  // redux
  const { homePage: { announcements = [], announcementTotal = 0 } = {} } = props;

  const [activePostID, setActivePostID] = useState('');
  const [limit, setLimit] = useState(10);

  const fetchData = () => {
    return dispatch({
      type: 'homePage/fetchAnnouncementsEffect',
      payload: {
        postType: TAB_IDS.ANNOUNCEMENTS,
        location: [getCurrentLocation()],
        page: 1,
        limit,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [limit]);

  const renderShowMoreBtn = () => {
    const showMore = announcements.length < announcementTotal;
    if (!showMore) return null;
    return (
      <Col span={24}>
        <div className={styles.loadMore}>
          <Button
            onClick={() => {
              setLimit(limit + 5);
            }}
          >
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
          <LazyLoad key={x._id} height={200} offset={[-100, 0]}>
            <Col span={24}>
              <div className={styles.card}>
                <EmployeeTag employee={x.createdBy} createDate={x.createdAt} />
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

  // RENDER UI
  return (
    <div className={styles.Announcements}>
      <p className={styles.title}>Announcements</p>
      {!loadingFetchAnnouncementList && announcements.length === 0 ? (
        <div className={styles.card}>
          <EmptyComponent description="No Announcements" />
        </div>
      ) : (
        <>{announcements.length > 0 ? spinWrap(renderData()) : skeletonWrap(renderData())}</>
      )}
    </div>
  );
};

export default connect(({ homePage, loading, user }) => ({
  homePage,
  user,
  loadingFetchAnnouncementList: loading.effects['homePage/fetchAnnouncementsEffect'],
}))(Announcements);
