import { Col, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import LazyLoad from 'react-lazyload';
import { connect } from 'umi';
import { TAB_IDS } from '@/utils/homePage';
import { getCurrentLocation } from '@/utils/authority';
import EmptyComponent from '@/components/Empty';
import EmployeeTag from './components/EmployeeTag';
import LikeComment from './components/LikeComment';
import PostContent from './components/PostContent';
import styles from './index.less';

const Announcements = (props) => {
  const { dispatch, loadingFetchAnnouncementList = false } = props;

  // redux
  const { homePage: { announcements = [] } = {} } = props;

  const [activePostID, setActivePostID] = useState('');

  const fetchData = () => {
    return dispatch({
      type: 'homePage/fetchAnnouncementsEffect',
      payload: {
        postType: TAB_IDS.ANNOUNCEMENTS,
        location: [getCurrentLocation()],
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // RENDER UI
  return (
    <div className={styles.Announcements}>
      <p className={styles.title}>Announcements</p>
      {!loadingFetchAnnouncementList && announcements.length === 0 ? (
        <div className={styles.card}>
          <EmptyComponent description="No Announcements" />
        </div>
      ) : (
        <Row gutter={[24, 24]} style={{ minHeight: 300 }}>
          <Skeleton active loading={loadingFetchAnnouncementList}>
            {[...announcements].reverse().map((x) => (
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
          </Skeleton>
        </Row>
      )}
    </div>
  );
};

export default connect(({ homePage, loading, user }) => ({
  homePage,
  user,
  loadingFetchAnnouncementList: loading.effects['homePage/fetchAnnouncementsEffect'],
}))(Announcements);
