import React, { useEffect } from 'react';
import { Col, Row, Skeleton, Spin } from 'antd';
import { connect } from 'umi';
import LazyLoad from 'react-lazyload';
import EmployeeTag from './components/EmployeeTag';
import PostContent from './components/PostContent';
import styles from './index.less';
import EmbedPost from './components/EmbedPost';
import { TAB_IDS } from '@/utils/homePage';
import EmptyComponent from '@/components/Empty';

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

  return (
    <div className={styles.Announcements}>
      <p className={styles.title}>Announcements</p>

      <Spin spinning={loadingFetchAnnouncementList}>
        <Row gutter={[24, 24]} style={{ minHeight: 300 }}>
          {[...announcements].reverse().map((x) => (
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
    </div>
  );
};

export default connect(({ homePage, loading }) => ({
  homePage,
  loadingFetchAnnouncementList: loading.effects['homePage/fetchAnnouncementsEffect1'],
}))(Announcements);
