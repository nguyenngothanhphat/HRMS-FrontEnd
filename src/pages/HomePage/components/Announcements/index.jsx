import { Col, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import LazyLoad from 'react-lazyload';
import { connect } from 'umi';
import { TAB_IDS } from '@/utils/homePage';
import EmptyComponent from '@/components/Empty';
import EmbedPost from './components/EmbedPost';
import EmployeeTag from './components/EmployeeTag';
import PostContent from './components/PostContent';
import styles from './index.less';
import { getCurrentLocation } from '@/utils/authority';

const Announcements = (props) => {
  const { dispatch, loadingFetchAnnouncementList = false } = props;

  // redux
  const { homePage: { announcements = [] } = {} } = props;

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
      {announcements.length === 0 ? (
        <div className={styles.card}>
          <EmptyComponent description="No Announcements" />
        </div>
      ) : (
        <Spin spinning={loadingFetchAnnouncementList}>
          <Row gutter={[24, 24]} style={{ minHeight: 300 }}>
            {[...announcements].reverse().map((x) => (
              <LazyLoad key={x._id} placeholder={<Spin active />}>
                <Col span={24}>
                  {x.embedLink ? (
                    <EmbedPost embedLink={x.embedLink} />
                  ) : (
                    <div className={styles.card}>
                      <EmployeeTag employee={x.createdBy} createDate={x.createdAt} />
                      <PostContent post={x} />
                    </div>
                  )}
                </Col>
              </LazyLoad>
            ))}
          </Row>
        </Spin>
      )}
    </div>
  );
};

export default connect(({ homePage, loading, user }) => ({
  homePage,
  user,
  loadingFetchAnnouncementList: loading.effects['homePage/fetchAnnouncementsEffect1'],
}))(Announcements);
