import { Col, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import LazyLoad from 'react-lazyload';
import { connect } from 'umi';
import { TAB_IDS } from '@/utils/homePage';
import EmptyComponent from '@/components/Empty';
import EmptyIcon from '@/assets/homePage/imageEmpty.png';
import EmbedPost from './components/EmbedPost';
import EmployeeTag from './components/EmployeeTag';
import PostContent from './components/PostContent';
import styles from './index.less';

const Announcements = (props) => {
  const { dispatch, loadingFetchAnnouncementList = false } = props;

  // redux
  const {
    homePage: { announcements = [] } = {},
    user: { currentUser: { location: { _id: locationId } = {} } = {} } = {},
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

  const obj = announcements.filter((item) => {
    const { location = [] } = item;
    return location.find((x) => x._id === locationId);
  });
  // RENDER UI

  return (
    <div className={styles.Announcements}>
      <p className={styles.title}>Announcements</p>
      {obj.length === 0 ? (
        <div className={styles.Voting}>
          <EmptyComponent description="No Announcements" image={EmptyIcon} />
        </div>
      ) : (
        <Spin spinning={loadingFetchAnnouncementList}>
          <Row gutter={[24, 24]} style={{ minHeight: 300 }}>
            {[...obj].reverse().map((x) => (
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
