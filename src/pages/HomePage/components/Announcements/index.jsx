import React, { useEffect } from 'react';
import { Col, Row, Skeleton, Spin } from 'antd';
import { connect } from 'umi';
import LazyLoad from 'react-lazyload';
import EmployeeTag from './components/EmployeeTag';
import PostContent from './components/PostContent';
import styles from './index.less';
import EmbedPost from './components/EmbedPost';
import { TAB_IDS } from '@/utils/homePage';

const Announcements = (props) => {
  const { dispatch, loadingFetchAnnouncementList = false } = props;

  // redux
  const {
    homePage: { announcements = [] } = {},
    // user: { currentUser: { employee = {} } = {} } = {},
  } = props;

  const fetchData = () => {
    return dispatch({
      type: 'homePage/fetchAnnouncementsEffect',
      payload: {
        postType: TAB_IDS.ANNOUNCEMENTS,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // RENDER UI
  if (loadingFetchAnnouncementList) {
    return (
      <div className={styles.Announcements}>
        <p className={styles.title}>Announcements</p>
        <Skeleton active />
      </div>
    );
  }
  if (announcements.length === 0) {
    return (
      <div className={styles.Announcements}>
        <p className={styles.title}>Announcements</p>
        <p>No announcements</p>
      </div>
    );
  }
  return (
    <div className={styles.Announcements}>
      <p className={styles.title}>Announcements</p>

      <Row gutter={[24, 24]}>
        {announcements.map((x) => (
          <LazyLoad key={x._id} placeholder={<Spin active />}>
            <Col span={24}>
              {x.embedLink ? (
                <EmbedPost embedLink={x.embedLink} />
              ) : (
                <div className={styles.card}>
                  <EmployeeTag employee={x.createdBy} />
                  <PostContent post={x} />
                </div>
              )}
            </Col>
          </LazyLoad>
        ))}
      </Row>
    </div>
  );
};

export default connect(({ homePage, loading }) => ({
  homePage,
  loadingFetchAnnouncementList: loading.effects['homePage/fetchAnnouncementsEffect'],
}))(Announcements);
